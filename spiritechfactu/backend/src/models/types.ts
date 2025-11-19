/**
 * types.ts - Definiciones de tipos y interfaces para SpiritechFactu
 * Incluye todas las estructuras de datos necesarias para cumplimiento AEAT/VeriFactu
 */

// ============================================================================
// TIPOS DE EMPRESA
// ============================================================================

export interface Company {
  id: string;
  name: string;
  taxId: string; // CIF/NIF
  email: string;
  phone?: string;
  address: string;
  city: string;
  postalCode: string;
  province: string;
  country: string;
  logo?: string; // URL o base64
  website?: string;
  createdAt: Date;
  updatedAt: Date;

  // Configuración AEAT/VeriFactu
  softwareId: string; // ID del software (asignado por AEAT)
  softwareVersion: string;
  verifactuMode: 'testing' | 'production';
  hashAlgorithm: 'SHA256' | 'SHA512';

  // Configuración fiscal
  defaultIVARate: number; // Porcentaje IVA por defecto (21, 10, 4, 0)
  defaultIGICRate?: number; // Para Canarias
  retentionPercentage?: number;
}

// ============================================================================
// TIPOS DE CLIENTE
// ============================================================================

export interface Customer {
  id: string;
  companyId: string;
  name: string;
  taxId?: string; // CIF/NIF del cliente
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  province?: string;
  country?: string;
  paymentTerms?: string; // Ej: "30 días", "Inmediato"
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// TIPOS DE FACTURA
// ============================================================================

export interface Invoice {
  id: string;
  companyId: string;
  invoiceNumber: string;
  customerId: string;

  // Fechas
  issueDate: Date;
  dueDate: Date;

  // Líneas de factura
  lines: InvoiceLine[];

  // Cálculos
  subtotal: number; // Base imponible
  ivaAmount: number;
  totalAmount: number;

  // Notas
  notes?: string;
  paymentMethod?: string;

  // Estados
  status: 'draft' | 'issued' | 'paid' | 'cancelled' | 'refunded';

  // VeriFactu/AEAT
  verifactuStatus: 'pending' | 'sent' | 'confirmed' | 'error';
  verifactuResponseId?: string;

  // Integridad
  hashCurrent: string; // Hash SHA256 de esta factura
  hashPrevious: string; // Hash de la factura anterior

  // Contenido XML
  xmlContent?: string; // XML de Alta VeriFactu

  // QR
  qrDataUrl?: string; // QR en base64

  // Metadatos
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  lastModifiedBy?: string;
}

// ============================================================================
// TIPOS DE LÍNEA DE FACTURA
// ============================================================================

export interface InvoiceLine {
  id: string;
  invoiceId: string;
  description: string;
  quantity: number;
  unitPrice: number;
  discount?: number; // Porcentaje de descuento (0-100)
  ivaRate: number; // Porcentaje IVA (21, 10, 4, 0)

  // Cálculos (se generan automáticamente)
  subtotal: number; // quantity * unitPrice * (1 - discount/100)
  ivaAmount: number; // subtotal * ivaRate / 100
  total: number; // subtotal + ivaAmount

  createdAt: Date;
}

// ============================================================================
// TIPOS DE REGISTROS VERIFACTU
// ============================================================================

export interface VerifactuRecord {
  id: string;
  invoiceId: string;
  companyId: string;

  // Datos de envío
  registroId: string; // ID del registro en AEAT
  xml: string; // XML enviado a AEAT
  type: 'alta' | 'anulacion'; // Tipo de registro

  // Respuesta AEAT
  aeatResponse?: string;
  aeatCode?: string; // Código de respuesta
  aeatMessage?: string;

  // Timestamps
  sentAt: Date;
  confirmedAt?: Date;

  createdAt: Date;
}

// ============================================================================
// TIPOS DE EVENTOS FISCALES (Trazabilidad)
// ============================================================================

export interface FiscalEvent {
  id: string;
  invoiceId: string;
  companyId: string;

  eventType:
    | 'invoice_created'
    | 'invoice_issued'
    | 'invoice_modified'
    | 'invoice_cancelled'
    | 'verifactu_sent'
    | 'verifactu_confirmed'
    | 'verifactu_error'
    | 'hash_verified';

  description: string;
  timestamp: Date;
  userId: string;

  // Trazabilidad
  previousHash?: string;
  currentHash?: string;
  changesSummary?: string;

  createdAt: Date;
}

// ============================================================================
// TIPOS DE RESPUESTA API
// ============================================================================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: string;
  };
  timestamp: Date;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  timestamp: Date;
}

// ============================================================================
// TIPOS PARA HASH Y SEGURIDAD
// ============================================================================

export interface HashCalculationInput {
  invoiceId: string;
  issueDate: string;
  subtotal: number;
  ivaAmount: number;
  totalAmount: number;
  previousHash: string;
  softwareId: string;
}

export interface VerifactuXmlInput {
  invoice: Invoice;
  company: Company;
  customer: Customer;
  previousHash: string;
}

// ============================================================================
// TIPOS PARA PDF
// ============================================================================

export interface PdfGenerationInput {
  invoice: Invoice;
  company: Company;
  customer: Customer;
  qrDataUrl: string;
}

// ============================================================================
// TIPOS DE ERRORES
// ============================================================================

export interface CustomError extends Error {
  code: string;
  statusCode: number;
  details?: string;
}
