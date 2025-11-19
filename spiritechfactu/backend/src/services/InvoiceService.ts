/**
 * InvoiceService.ts - Lógica de negocio para facturas
 * Cálculos, validaciones, flujos de vida de factura
 */

import { v4 as uuidv4 } from 'uuid';
import { Invoice, InvoiceLine, VerifactuXmlInput } from '../models/types';
import { HashService } from './HashService';
import { VerifactuService } from './VerifactuService';
import { ValidationError } from '../utils/errors';
import { validateInvoiceCalculations } from '../utils/validation';

export class InvoiceService {
  /**
   * Crea una nueva factura con cálculos automáticos
   * Valida todos los datos y prepara para emisión
   *
   * @param invoiceNumber - Número de factura
   * @param customerId - ID del cliente
   * @param companyId - ID de la empresa
   * @param lines - Líneas de factura
   * @param dates - Fechas de emisión y vencimiento
   * @param userId - Usuario que crea la factura
   * @returns Factura creada con cálculos
   */
  static createInvoice(
    invoiceNumber: string,
    customerId: string,
    companyId: string,
    lines: InvoiceLine[],
    dates: { issueDate: Date; dueDate: Date },
    userId: string
  ): Invoice {
    // Validar que hay líneas
    if (!lines || lines.length === 0) {
      throw new ValidationError('Debe haber al menos una línea en la factura');
    }

    // Calcular totales
    const { subtotal, ivaAmount, totalAmount } = this.calculateTotals(lines);

    // Hash inicial (se completará cuando se emita)
    const invoice: Invoice = {
      id: uuidv4(),
      companyId,
      invoiceNumber,
      customerId,
      issueDate: dates.issueDate,
      dueDate: dates.dueDate,
      lines,
      subtotal,
      ivaAmount,
      totalAmount,
      status: 'draft',
      verifactuStatus: 'pending',
      hashCurrent: '', // Se genera al emitir
      hashPrevious: '', // Se obtendrá de la anterior
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: userId,
    };

    return invoice;
  }

  /**
   * Calcula los totales de una factura a partir de sus líneas
   * Implementa precisión decimal correcta sin errores de redondeo
   *
   * @param lines - Líneas de factura
   * @returns { subtotal, ivaAmount, totalAmount }
   */
  static calculateTotals(lines: InvoiceLine[]): {
    subtotal: number;
    ivaAmount: number;
    totalAmount: number;
  } {
    let subtotal = 0;
    let totalIVA = 0;

    // Calcular para cada línea
    for (const line of lines) {
      // subtotal = cantidad * precio * (1 - descuento/100)
      const lineSubtotal = line.quantity * line.unitPrice * (1 - (line.discount || 0) / 100);

      // Redondear a 2 decimales
      const roundedSubtotal = Math.round(lineSubtotal * 100) / 100;

      // IVA = subtotal * tasa / 100
      const lineIVA = Math.round(roundedSubtotal * (line.ivaRate / 100) * 100) / 100;

      subtotal += roundedSubtotal;
      totalIVA += lineIVA;

      // Actualizar cálculos en la línea
      line.subtotal = roundedSubtotal;
      line.ivaAmount = lineIVA;
      line.total = roundedSubtotal + lineIVA;
    }

    // Redondear totales finales
    subtotal = Math.round(subtotal * 100) / 100;
    totalIVA = Math.round(totalIVA * 100) / 100;
    const totalAmount = Math.round((subtotal + totalIVA) * 100) / 100;

    return {
      subtotal,
      ivaAmount: totalIVA,
      totalAmount,
    };
}

  /**
   * Emite una factura (cambia estado de draft a issued)
   * Genera hash encadenado y prepara para VeriFactu
   *
   * @param invoice - Factura a emitir
   * @param previousHash - Hash de la factura anterior
   * @param softwareId - ID del software
   * @returns Factura emitida
   */
  static issueInvoice(invoice: Invoice, previousHash: string, softwareId: string): Invoice {
    if (invoice.status !== 'draft') {
      throw new ValidationError(`No se puede emitir una factura con estado "${invoice.status}"`);
    }

    // Calcular hash de esta factura (encadenado)
    const hashInput = {
      invoiceId: invoice.id,
      issueDate: invoice.issueDate.toISOString().split('T')[0],
      subtotal: invoice.subtotal,
      ivaAmount: invoice.ivaAmount,
      totalAmount: invoice.totalAmount,
      previousHash,
      softwareId,
    };

    invoice.hashPrevious = previousHash;
    invoice.hashCurrent = HashService.calculateHash(hashInput);
    invoice.status = 'issued';
    invoice.updatedAt = new Date();

    return invoice;
  }

  /**
   * Anula una factura emitida
   * Registra el evento y prepara para anulación en AEAT
   *
   * @param invoice - Factura a anular
   * @param userId - Usuario que anula
   * @returns Factura anulada
   */
  static cancelInvoice(invoice: Invoice, userId: string): Invoice {
    if (invoice.status === 'cancelled') {
      throw new ValidationError('La factura ya está anulada');
    }

    invoice.status = 'cancelled';
    invoice.updatedAt = new Date();
    invoice.lastModifiedBy = userId;

    return invoice;
  }

  /**
   * Marca una factura como pagada
   * @param invoice - Factura a marcar
   * @param userId - Usuario que registra el pago
   * @returns Factura actualizada
   */
  static markAsPaid(invoice: Invoice, userId: string): Invoice {
    if (invoice.status === 'cancelled') {
      throw new ValidationError('No se puede marcar como pagada una factura cancelada');
    }

    invoice.status = 'paid';
    invoice.updatedAt = new Date();
    invoice.lastModifiedBy = userId;

    return invoice;
  }

  /**
   * Valida los cálculos de una factura
   * Útil para auditoría y verificación de integridad
   *
   * @param invoice - Factura a validar
   * @throws ValidationError si hay discrepancias
   */
  static validateCalculations(invoice: Invoice): void {
    // Recalcular totales
    const { subtotal, ivaAmount, totalAmount } = this.calculateTotals(invoice.lines);

    // Comparar con los valores almacenados
    if (Math.abs(invoice.subtotal - subtotal) > 0.01) {
      throw new ValidationError(
        'Error en subtotal: esperado ' + subtotal + ', encontrado ' + invoice.subtotal
      );
    }

    if (Math.abs(invoice.ivaAmount - ivaAmount) > 0.01) {
      throw new ValidationError(
        'Error en IVA: esperado ' + ivaAmount + ', encontrado ' + invoice.ivaAmount
      );
    }

    if (Math.abs(invoice.totalAmount - totalAmount) > 0.01) {
      throw new ValidationError(
        'Error en total: esperado ' + totalAmount + ', encontrado ' + invoice.totalAmount
      );
    }
  }

  /**
   * Verifica la integridad de una factura comparando su hash
   * @param invoice - Factura a verificar
   * @param softwareId - ID del software
   * @returns boolean
   */
  static verifyInvoiceIntegrity(invoice: Invoice, softwareId: string): boolean {
    if (!invoice.hashCurrent) {
      return false;
    }

    const hashInput = {
      invoiceId: invoice.id,
      issueDate: invoice.issueDate.toISOString().split('T')[0],
      subtotal: invoice.subtotal,
      ivaAmount: invoice.ivaAmount,
      totalAmount: invoice.totalAmount,
      previousHash: invoice.hashPrevious,
      softwareId,
    };

    return HashService.verifyHash(hashInput, invoice.hashCurrent);
  }

  /**
   * Añade una línea a una factura en draft
   * @param invoice - Factura
   * @param line - Línea a añadir
   * @throws ValidationError si no está en draft
   */
  static addLineToInvoice(invoice: Invoice, line: InvoiceLine): void {
    if (invoice.status !== 'draft') {
      throw new ValidationError('Solo se pueden añadir líneas a facturas en borrador');
    }

    line.id = uuidv4();
    line.invoiceId = invoice.id;
    line.createdAt = new Date();

    // Recalcular línea
    line.subtotal = line.quantity * line.unitPrice * (1 - (line.discount || 0) / 100);
    line.ivaAmount = Math.round(line.subtotal * (line.ivaRate / 100) * 100) / 100;
    line.total = line.subtotal + line.ivaAmount;

    invoice.lines.push(line);

    // Recalcular totales de la factura
    const totals = this.calculateTotals(invoice.lines);
    invoice.subtotal = totals.subtotal;
    invoice.ivaAmount = totals.ivaAmount;
    invoice.totalAmount = totals.totalAmount;
  }

  /**
   * Elimina una línea de una factura en draft
   * @param invoice - Factura
   * @param lineId - ID de la línea
   * @throws ValidationError si no está en draft
   */
  static removeLineFromInvoice(invoice: Invoice, lineId: string): void {
    if (invoice.status !== 'draft') {
      throw new ValidationError('Solo se pueden eliminar líneas de facturas en borrador');
    }

    invoice.lines = invoice.lines.filter((l) => l.id !== lineId);

    // Recalcular totales
    const totals = this.calculateTotals(invoice.lines);
    invoice.subtotal = totals.subtotal;
    invoice.ivaAmount = totals.ivaAmount;
    invoice.totalAmount = totals.totalAmount;
  }
}
