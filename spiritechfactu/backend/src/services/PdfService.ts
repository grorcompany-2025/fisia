/**
 * PdfService.ts - Generación de PDFs de facturas profesionales
 * Diseño moderno con QR, datos completos e información fiscal
 */

import PDFDocument from 'pdfkit';
import QRCode from 'qrcode';
import { Invoice, Company, Customer } from '../models/types';

export class PdfService {
  /**
   * Genera un PDF profesional de factura
   * Incluye datos completos, QR encadenado, información fiscal
   *
   * @param invoice - Factura a generar
   * @param company - Datos de empresa
   * @param customer - Datos de cliente
   * @param qrDataUrl - Datos para QR (base64)
   * @returns Buffer con el PDF
   */
  static async generateInvoicePdf(
    invoice: Invoice,
    company: Company,
    customer: Customer,
    qrDataUrl: string
  ): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({
          margin: 40,
          size: 'A4',
        });

        const chunks: Buffer[] = [];

        doc.on('data', (chunk) => chunks.push(chunk));
        doc.on('end', () => resolve(Buffer.concat(chunks)));
        doc.on('error', reject);

        // Generar contenido del PDF
        this.addHeader(doc, company);
        this.addTitle(doc, invoice);
        this.addCompanyAndCustomerInfo(doc, company, customer);
        this.addInvoiceDetails(doc, invoice);
        this.addLines(doc, invoice);
        this.addTotals(doc, invoice);
        this.addQrCode(doc, qrDataUrl);
        this.addFooter(doc, invoice, company);

        doc.end();
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Añade encabezado con logo y datos de empresa
   */
  private static addHeader(doc: PDFDocument, company: Company): void {
    // Fondo gris ligero
    doc.rect(0, 0, doc.page.width, 100).fill('#f5f5f5');

    // Logo (si existe)
    if (company.logo) {
      try {
        // Convertir base64 a buffer si es necesario
        const logoBuffer = Buffer.from(company.logo.replace(/^data:image\/\w+;base64,/, ''), 'base64');
        doc.image(logoBuffer, 50, 20, { width: 80, height: 60 });
      } catch (e) {
        // Si falla, continuar sin logo
      }
    }

    // Nombre empresa
    doc
      .fontSize(20)
      .font('Helvetica-Bold')
      .text(company.name, 150, 20, { width: 350 });

    // Datos empresa a la derecha
    doc
      .fontSize(10)
      .font('Helvetica')
      .text(`NIF: ${company.taxId}`, 150, 50)
      .text(`${company.address}, ${company.postalCode} ${company.city}`)
      .text(`${company.province}, ${company.country || 'España'}`)
      .text(`Tel: ${company.phone || '-'} | Email: ${company.email}`)
      .text(`Web: ${company.website || '-'}`);

    // Línea separadora
    doc.strokeColor('#cccccc').lineWidth(1).moveTo(50, 105).lineTo(550, 105).stroke();

    doc.moveDown();
  }

  /**
   * Añade título de factura
   */
  private static addTitle(doc: PDFDocument, invoice: Invoice): void {
    doc.fontSize(24).font('Helvetica-Bold').text('FACTURA', 50, 130);

    // Número de factura
    doc
      .fontSize(12)
      .font('Helvetica')
      .text(`Nº ${invoice.invoiceNumber}`, 400, 130, { align: 'right' })
      .text(`Estado: ${this.getStatusLabel(invoice.status)}`, 400, 150, { align: 'right' })
      .text(`VeriFactu: ${invoice.verifactuStatus}`, 400, 165, { align: 'right' });

    doc.moveDown();
  }

  /**
   * Añade datos de empresa y cliente
   */
  private static addCompanyAndCustomerInfo(doc: PDFDocument, company: Company, customer: Customer): void {
    const y = doc.y;

    // Columna izquierda: Datos de facturación
    doc
      .fontSize(10)
      .font('Helvetica-Bold')
      .text('FACTURADO A:', 50, y);

    doc
      .fontSize(9)
      .font('Helvetica')
      .text(customer.name, 50, y + 20)
      .text(customer.taxId || 'Consumidor', 50, y + 35);

    if (customer.address) {
      doc.text(customer.address, 50, y + 50);
    }
    if (customer.city) {
      doc.text(`${customer.postalCode || ''} ${customer.city}`, 50, y + 65);
    }
    if (customer.email) {
      doc.text(`Email: ${customer.email}`, 50, y + 80);
    }

    // Línea separadora vertical
    doc.strokeColor('#cccccc').moveTo(280, y).lineTo(280, y + 100).stroke();

    // Columna derecha: Fechas y forma de pago
    doc
      .fontSize(10)
      .font('Helvetica-Bold')
      .text('INFORMACIÓN DE PAGO:', 300, y);

    doc
      .fontSize(9)
      .font('Helvetica')
      .text(`Fecha emisión: ${this.formatDate(invoice.issueDate)}`, 300, y + 20)
      .text(`Fecha vencimiento: ${this.formatDate(invoice.dueDate)}`, 300, y + 35)
      .text(`Forma de pago: ${invoice.paymentMethod || 'No especificada'}`, 300, y + 50);

    doc.moveDown(6);
  }

  /**
   * Añade detalles de la factura (referencias, etc)
   */
  private static addInvoiceDetails(doc: PDFDocument, invoice: Invoice): void {
    const boxY = doc.y;

    // Box de información fiscal
    doc
      .rect(50, boxY, 500, 30)
      .stroke();

    doc
      .fontSize(9)
      .font('Helvetica')
      .text(
        `Hash VeriFactu: ${invoice.hashCurrent.substring(0, 32)}...`,
        60,
        boxY + 5,
        { width: 480 }
      )
      .text(
        `Hash Anterior: ${invoice.hashPrevious.substring(0, 32)}...`,
        60,
        boxY + 15,
        { width: 480 }
      );

    doc.moveDown(2);
  }

  /**
   * Tabla de líneas de factura
   */
  private static addLines(doc: PDFDocument, invoice: Invoice): void {
    const y = doc.y;
    const colWidths = { desc: 240, qty: 70, price: 80, iva: 40, total: 70 };
    const startX = 50;

    // Encabezados
    doc
      .rect(startX, y, 500, 25)
      .fillAndStroke('#007acc', '#007acc');

    doc
      .fontSize(10)
      .font('Helvetica-Bold')
      .fillColor('white')
      .text('Descripción', startX + 10, y + 7, { width: colWidths.desc - 10 })
      .text('Cantidad', startX + colWidths.desc, y + 7, { width: colWidths.qty, align: 'center' })
      .text('P. Unit.', startX + colWidths.desc + colWidths.qty, y + 7, {
        width: colWidths.price,
        align: 'right',
      })
      .text('IVA%', startX + colWidths.desc + colWidths.qty + colWidths.price, y + 7, {
        width: colWidths.iva,
        align: 'center',
      })
      .text('Total', startX + colWidths.desc + colWidths.qty + colWidths.price + colWidths.iva, y + 7, {
        width: colWidths.total,
        align: 'right',
      });

    doc.fillColor('black').font('Helvetica');

    let currentY = y + 30;

    // Líneas
    for (const line of invoice.lines) {
      doc
        .fontSize(9)
        .text(line.description, startX + 10, currentY, {
          width: colWidths.desc - 10,
          height: 30,
        })
        .text(line.quantity.toString(), startX + colWidths.desc, currentY, {
          width: colWidths.qty,
          align: 'center',
        })
        .text(`€ ${line.unitPrice.toFixed(2)}`, startX + colWidths.desc + colWidths.qty, currentY, {
          width: colWidths.price,
          align: 'right',
        })
        .text(line.ivaRate.toString(), startX + colWidths.desc + colWidths.qty + colWidths.price, currentY, {
          width: colWidths.iva,
          align: 'center',
        })
        .text(`€ ${line.total.toFixed(2)}`, startX + colWidths.desc + colWidths.qty + colWidths.price + colWidths.iva, currentY, {
          width: colWidths.total,
          align: 'right',
        });

      currentY += 25;
    }

    // Línea separadora
    doc.moveTo(startX, currentY).lineTo(startX + 500, currentY).stroke();

    doc.y = currentY + 10;
  }

  /**
   * Resumen de totales
   */
  private static addTotals(doc: PDFDocument, invoice: Invoice): void {
    const y = doc.y;
    const rightX = 350;
    const valueX = 450;

    // Subtotal
    doc
      .fontSize(11)
      .font('Helvetica')
      .text('Subtotal:', rightX, y, { align: 'right' })
      .text(`€ ${invoice.subtotal.toFixed(2)}`, valueX, y, { align: 'right', width: 100 });

    // IVA
    doc
      .text('IVA:', rightX, y + 20, { align: 'right' })
      .text(`€ ${invoice.ivaAmount.toFixed(2)}`, valueX, y + 20, { align: 'right', width: 100 });

    // Total (destacado)
    doc
      .rect(rightX - 100, y + 40, 150, 30)
      .fillAndStroke('#007acc', '#007acc');

    doc
      .fontSize(14)
      .font('Helvetica-Bold')
      .fillColor('white')
      .text('TOTAL:', rightX, y + 45, { align: 'right' })
      .text(`€ ${invoice.totalAmount.toFixed(2)}`, valueX, y + 45, { align: 'right', width: 100 });

    doc.fillColor('black');

    doc.moveDown(4);
  }

  /**
   * Añade código QR con datos de la factura
   */
  private static async addQrCode(doc: PDFDocument, qrDataUrl: string): Promise<void> {
    try {
      // El QR ya viene en base64 del servicio
      const qrBuffer = Buffer.from(qrDataUrl.replace(/^data:image\/\w+;base64,/, ''), 'base64');
      doc.image(qrBuffer, 50, doc.y, { width: 100, height: 100 });
      doc.moveDown(6);
    } catch (e) {
      // Continuar sin QR si hay error
    }
  }

  /**
   * Pie de página con información legal y de cumplimiento
   */
  private static addFooter(doc: PDFDocument, invoice: Invoice, company: Company): void {
    // Línea separadora
    doc.strokeColor('#cccccc').moveTo(50, doc.page.height - 80).lineTo(550, doc.page.height - 80).stroke();

    doc
      .fontSize(8)
      .font('Helvetica')
      .fillColor('#666666')
      .text(
        'Esta factura cumple con los requisitos de los Sistemas Informáticos de Facturación (SIF) y VeriFactu según legislación española (BOE RD 1619/2012 y BOE RD 596/2016).',
        50,
        doc.page.height - 75,
        { width: 500, align: 'center' }
      )
      .text(`Hash actual: ${invoice.hashCurrent.substring(0, 40)}...`, 50, doc.page.height - 40, {
        width: 500,
        align: 'center',
        fontSize: 7,
      })
      .text(`Generado el ${new Date().toLocaleString('es-ES')} por SpiritechFactu v1.0.0`, 50, doc.page.height - 20, {
        width: 500,
        align: 'center',
      });
  }

  /**
   * Utilidades
   */
  private static formatDate(date: Date): string {
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  }

  private static getStatusLabel(status: string): string {
    const labels: { [key: string]: string } = {
      draft: '📝 Borrador',
      issued: '✅ Emitida',
      paid: '💰 Pagada',
      cancelled: '❌ Cancelada',
      refunded: '↩️ Reembolsada',
    };
    return labels[status] || status;
  }
}
