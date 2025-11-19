/**
 * VerifactuService.ts - Servicio de VeriFactu AEAT
 * Genera XML, gestiona integración con AEAT y cumplimiento normativo
 *
 * Referencia: Técnicas de Tipificación del Registro de VeriFactu
 * https://www.agenciatributaria.gob.es/
 */

import { Invoice, Company, Customer, VerifactuXmlInput } from '../models/types';
import { HashService } from './HashService';
import { VERIFACTU_MODE, SOFTWARE_ID, SOFTWARE_VERSION } from '../config/env';
import { VerifactuError } from '../utils/errors';

export class VerifactuService {
  /**
   * Genera el XML de Alta de VeriFactu según especificación AEAT
   * Este XML es el core de la integración con AEAT
   *
   * ESTRUCTURA:
   * - Identificadores de empresa (NIF)
   * - Número de registro y fecha
   * - Datos de software
   * - Líneas de factura
   * - Importes y cálculos
   * - Hash encadenado
   * - Datos del cliente
   *
   * TODO: Adaptar XSD exacto de AEAT según versión actual
   *
   * @param input - Datos de factura, empresa, cliente
   * @returns XML válido para envío a AEAT
   */
  static generateAltaXml(input: VerifactuXmlInput): string {
    const { invoice, company, customer, previousHash } = input;

    // Validar datos críticos
    this.validateInputData(invoice, company);

    // Formatear fechas según normativa AEAT (ISO 8601)
    const issueDateStr = this.formatDateISO(invoice.issueDate);
    const dueDateStr = this.formatDateISO(invoice.dueDate);

    // Calcular hash de esta factura (encadenado)
    const currentHash = HashService.calculateHash({
      invoiceId: invoice.id,
      issueDate: issueDateStr,
      subtotal: invoice.subtotal,
      ivaAmount: invoice.ivaAmount,
      totalAmount: invoice.totalAmount,
      previousHash,
      softwareId: SOFTWARE_ID,
    });

    // Construir líneas XML
    const linesXml = invoice.lines
      .map(
        (line) => `
    <Linea>
      <NumLinea>${invoice.lines.indexOf(line) + 1}</NumLinea>
      <Descripcion><![CDATA[${this.escapeXml(line.description)}]]></Descripcion>
      <Cantidad>${line.quantity.toFixed(2)}</Cantidad>
      <PrecioUnitario>${line.unitPrice.toFixed(2)}</PrecioUnitario>
      <Descuento>${(line.discount || 0).toFixed(2)}</Descuento>
      <Subtotal>${line.subtotal.toFixed(2)}</Subtotal>
      <TipoIVA>${line.ivaRate}</TipoIVA>
      <ImporteIVA>${line.ivaAmount.toFixed(2)}</ImporteIVA>
      <TotalLinea>${line.total.toFixed(2)}</TotalLinea>
    </Linea>`
      )
      .join('\n');

    // TODO: Estructura exacta según XSD AEAT actual
    // Los campos con TODO deben adaptarse a la especificación oficial
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<VeriFactu>
  <!-- ENCABEZADO: Datos de la empresa y registro -->
  <Encabezado>
    <NumeroRegistro>${invoice.invoiceNumber}</NumeroRegistro>
    <FechaEmision>${issueDateStr}</FechaEmision>
    <FechaVencimiento>${dueDateStr}</FechaVencimiento>
  </Encabezado>

  <!-- EMPRESA: Datos del emisor -->
  <Empresa>
    <NIF>${company.taxId}</NIF>
    <RazonSocial><![CDATA[${this.escapeXml(company.name)}]]></RazonSocial>
    <Domicilio><![CDATA[${this.escapeXml(company.address)}]]></Domicilio>
    <Municipio>${company.city}</Municipio>
    <Provincia>${company.province}</Provincia>
    <CodigoPostal>${company.postalCode}</CodigoPostal>
    <Pais>${company.country || 'ES'}</Pais>
    <Email>${company.email}</Email>
  </Empresa>

  <!-- SOFTWARE: Identificación del software -->
  <Software>
    <SoftwareId>${SOFTWARE_ID}</SoftwareId>
    <Versi\u00f3n>${SOFTWARE_VERSION}</Versi\u00f3n>
    <Modo>${VERIFACTU_MODE === 'testing' ? 'Prueba' : 'Producci\u00f3n'}</Modo>
  </Software>

  <!-- CLIENTE: Datos del receptor -->
  <Cliente>
    <Identificacion>${customer.taxId || 'Consumidor'}</Identificacion>
    <Nombre><![CDATA[${this.escapeXml(customer.name)}]]></Nombre>
    ${customer.email ? `<Email>${customer.email}</Email>` : ''}
  </Cliente>

  <!-- IMPORTES: Totales de la factura -->
  <Importes>
    <BaseImponible>${invoice.subtotal.toFixed(2)}</BaseImponible>
    <ImporteIVA>${invoice.ivaAmount.toFixed(2)}</ImporteIVA>
    <ImporteTotal>${invoice.totalAmount.toFixed(2)}</ImporteTotal>
  </Importes>

  <!-- LINEAS: Detalles de la factura -->
  <Lineas>${linesXml}
  </Lineas>

  <!-- INTEGRIDAD: Hash encadenado para VeriFactu -->
  <Integridad>
    <HashAnterior>${previousHash}</HashAnterior>
    <HashActual>${currentHash}</HashActual>
    <Algoritmo>${HashService.getAlgorithm()}</Algoritmo>
  </Integridad>

  <!-- FIRMA: TODO - Implementar firma digital real -->
  <!-- En producción, este campo debe contener:
       - Certificado digital del firmante
       - Firma XMLDSIG según estándar AEAT
       - Timestamp de servidor de marcas de tiempo oficial
  -->
  <Firma>
    <TODO_CERTIFICADO>Incluir certificado digital real en producción</TODO_CERTIFICADO>
    <TODO_FIRMA_XMLDSIG>Incluir firma XMLDSIG según AEAT</TODO_FIRMA_XMLDSIG>
    <TODO_TIMESTAMP>Incluir timestamp de servidor de marcas de tiempo</TODO_TIMESTAMP>
  </Firma>

  <!-- METADATOS -->
  <Metadatos>
    <FacturaId>${invoice.id}</FacturaId>
    <FechaGeneracion>${new Date().toISOString()}</FechaGeneracion>
    ${invoice.notes ? `<Notas><![CDATA[${this.escapeXml(invoice.notes)}]]></Notas>` : ''}
  </Metadatos>
</VeriFactu>`;

    return xml;
  }

  /**
   * Genera XML de Anulación de VeriFactu
   * Se usa cuando se necesita cancelar una factura emitida
   *
   * TODO: Completar según normativa AEAT para anulaciones
   *
   * @param invoice - Factura a anular
   * @param company - Datos de empresa
   * @param previousHash - Hash anterior
   * @returns XML de anulación
   */
  static generateAnulacionXml(invoice: Invoice, company: Company, previousHash: string): string {
    this.validateInputData(invoice, company);

    const issueDateStr = this.formatDateISO(invoice.issueDate);

    // TODO: Implementar lógica completa de anulación
    // La anulación debe incluir:
    // - Motivo de anulación
    // - Nuevo hash reflejo de la anulación
    // - Referencia a factura original
    // - Firma digital

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<VeriFactuAnulacion>
  <NumeroRegistro>${invoice.invoiceNumber}</NumeroRegistro>
  <FechaAnulacion>${issueDateStr}</FechaAnulacion>
  <Empresa>
    <NIF>${company.taxId}</NIF>
  </Empresa>
  <Motivo>TODO_MOTIVO_ANULACION</Motivo>
  <!-- TODO: Completar estructura de anulación -->
</VeriFactuAnulacion>`;

    return xml;
  }

  /**
   * Prepara datos para envío SOAP a AEAT
   * Envuelve el XML en la estructura SOAP requerida
   *
   * TODO: Adaptar al WSDL exacto de AEAT VeriFactu
   *
   * @param xmlContent - XML de alta/anulación
   * @param company - Datos de empresa
   * @returns SOAP Request completo
   */
  static generateSOAPRequest(xmlContent: string, company: Company): string {
    // TODO: Implementar envoltura SOAP completa
    // Referencias a incluir:
    // - Namespace correcto de AEAT
    // - Autenticación (certificado digital)
    // - Estructura de envoltura SOAP 1.2

    const soapRequest = `<?xml version="1.0" encoding="UTF-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:vf="http://www.agenciatributaria.gob.es/verifactu">
  <soap:Header>
    <!-- TODO: Incluir headers de autenticación -->
    <vf:Autenticacion>
      <vf:NIF>${company.taxId}</vf:NIF>
      <vf:CertificadoDigital>TODO_CERTIFICADO_REAL</vf:CertificadoDigital>
    </vf:Autenticacion>
  </soap:Header>
  <soap:Body>
    <vf:Alta>
      ${xmlContent}
    </vf:Alta>
  </soap:Body>
</soap:Envelope>`;

    return soapRequest;
  }

  /**
   * Envía XML a AEAT vía SOAP
   * TODO: Implementar conexión real
   *
   * @param soapRequest - Request SOAP
   * @returns Respuesta de AEAT
   */
  static async sendToAEAT(soapRequest: string): Promise<any> {
    // TODO: Implementar envío real
    // Debe incluir:
    // 1. Carga del certificado digital
    // 2. Conexión HTTPS al endpoint de AEAT
    // 3. Validación de respuesta
    // 4. Manejo de errores y reintentos

    console.log('📡 [TODO] Enviar a AEAT:');
    console.log(soapRequest);

    // Simulación: respuesta mock para testing
    return {
      success: true,
      registroId: `REG-${Date.now()}`,
      codigo: '0000',
      mensaje: '[TESTING] Aceptado para procesar',
    };
  }

  /**
   * Valida que los datos esenciales estén presentes
   * @param invoice - Factura a validar
   * @param company - Empresa a validar
   * @throws VerifactuError si faltan datos críticos
   */
  private static validateInputData(invoice: Invoice, company: Company): void {
    if (!invoice.id || !invoice.invoiceNumber) {
      throw new VerifactuError(
        'Datos de factura incompletos',
        'INVALID_INVOICE_DATA',
        'Faltan ID o número de factura'
      );
    }

    if (!company.taxId || !company.name) {
      throw new VerifactuError(
        'Datos de empresa incompletos',
        'INVALID_COMPANY_DATA',
        'Faltan NIF o nombre de empresa'
      );
    }
  }

  /**
   * Formatea una fecha en formato ISO 8601 para AEAT
   * @param date - Fecha a formatear
   * @returns Fecha en formato YYYY-MM-DD
   */
  private static formatDateISO(date: Date): string {
    const d = new Date(date);
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${d.getFullYear()}-${month}-${day}`;
  }

  /**
   * Escapa caracteres especiales para XML
   * @param text - Texto a escapar
   * @returns Texto escapado
   */
  private static escapeXml(text: string): string {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }
}
