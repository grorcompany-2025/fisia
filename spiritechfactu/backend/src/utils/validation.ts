/**
 * validation.ts - Validación de entradas y datos
 * Incluye esquemas Joi y funciones de validación reutilizables
 */

import Joi from 'joi';

// ============================================================================
// ESQUEMAS DE VALIDACIÓN
// ============================================================================

/** Esquema para crear/actualizar empresa */
export const companySchema = Joi.object({
  name: Joi.string().required().trim().min(3).max(255),
  taxId: Joi.string().required().uppercase().regex(/^[A-Z0-9]{8,12}$/, 'CIF/NIF válido'),
  email: Joi.string().required().email(),
  phone: Joi.string().optional().trim(),
  address: Joi.string().required().trim().min(3),
  city: Joi.string().required().trim().min(2),
  postalCode: Joi.string().required().regex(/^\d{5}$/),
  province: Joi.string().required().trim(),
  country: Joi.string().optional().default('ES'),
  website: Joi.string().optional().uri(),
  softwareId: Joi.string().required(),
  softwareVersion: Joi.string().required(),
  verifactuMode: Joi.string().valid('testing', 'production').default('testing'),
  hashAlgorithm: Joi.string().valid('SHA256', 'SHA512').default('SHA256'),
  defaultIVARate: Joi.number().valid(0, 4, 10, 21).default(21),
  defaultIGICRate: Joi.number().optional(),
  retentionPercentage: Joi.number().optional().min(0).max(100),
});

/** Esquema para crear/actualizar cliente */
export const customerSchema = Joi.object({
  name: Joi.string().required().trim().min(3).max(255),
  taxId: Joi.string().optional().uppercase(),
  email: Joi.string().optional().email(),
  phone: Joi.string().optional().trim(),
  address: Joi.string().optional().trim(),
  city: Joi.string().optional().trim(),
  postalCode: Joi.string().optional(),
  province: Joi.string().optional().trim(),
  country: Joi.string().optional(),
  paymentTerms: Joi.string().optional().trim(),
});

/** Esquema para crear línea de factura */
export const invoiceLineSchema = Joi.object({
  description: Joi.string().required().trim().min(3).max(500),
  quantity: Joi.number().required().positive().precision(2),
  unitPrice: Joi.number().required().positive().precision(2),
  discount: Joi.number().optional().min(0).max(100),
  ivaRate: Joi.number().valid(0, 4, 10, 21).required(),
});

/** Esquema para crear/actualizar factura */
export const invoiceSchema = Joi.object({
  customerId: Joi.string().required(),
  invoiceNumber: Joi.string().required().trim(),
  issueDate: Joi.date().required(),
  dueDate: Joi.date().required().min(Joi.ref('issueDate')),
  lines: Joi.array().items(invoiceLineSchema).required().min(1),
  notes: Joi.string().optional().max(1000),
  paymentMethod: Joi.string().optional(),
  status: Joi.string().valid('draft', 'issued', 'paid', 'cancelled', 'refunded').default('draft'),
});

// ============================================================================
// FUNCIONES DE VALIDACIÓN
// ============================================================================

/**
 * Valida un objeto contra un esquema Joi
 * @param object - Objeto a validar
 * @param schema - Esquema Joi
 * @returns { valid: boolean, error?: string, value?: any }
 */
export function validateWithSchema(object: any, schema: Joi.Schema): {
  valid: boolean;
  error?: string;
  value?: any;
} {
  const { error, value } = schema.validate(object, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    const messages = error.details.map((d) => `${d.path.join('.')}: ${d.message}`);
    return {
      valid: false,
      error: messages.join('; '),
    };
  }

  return {
    valid: true,
    value,
  };
}

/**
 * Valida que un CIF/NIF sea correcto
 * @param taxId - CIF o NIF
 * @returns boolean
 */
export function isValidTaxId(taxId: string): boolean {
  // Validación simple de CIF/NIF español
  // TODO: Mejorar con algoritmo de verificación oficial
  const cifPattern = /^[A-Z][0-9]{7}[0-9A-Z]$/;
  const nifPattern = /^[0-9]{8}[A-Z]$/;

  return cifPattern.test(taxId) || nifPattern.test(taxId);
}

/**
 * Valida email
 * @param email - Email a validar
 * @returns boolean
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Valida código postal español
 * @param postalCode - Código postal
 * @returns boolean
 */
export function isValidPostalCode(postalCode: string): boolean {
  return /^\d{5}$/.test(postalCode);
}

/**
 * Valida que los cálculos de una factura sean correctos
 * @param subtotal - Base imponible
 * @param ivaAmount - Importe IVA
 * @param ivaRate - Porcentaje IVA
 * @param totalAmount - Total factura
 * @returns boolean
 */
export function validateInvoiceCalculations(
  subtotal: number,
  ivaAmount: number,
  ivaRate: number,
  totalAmount: number
): boolean {
  // Redondeo a 2 decimales para comparación
  const calculatedIVA = Math.round(subtotal * (ivaRate / 100) * 100) / 100;
  const calculatedTotal = Math.round((subtotal + calculatedIVA) * 100) / 100;

  // Margen de error de 0.01 por redondeos
  return (
    Math.abs(ivaAmount - calculatedIVA) < 0.01 &&
    Math.abs(totalAmount - calculatedTotal) < 0.01
  );
}

/**
 * Valida que los datos requeridos para hash estén presentes
 * @param data - Datos a validar
 * @returns boolean
 */
export function validateHashData(data: any): boolean {
  return !!(
    data.invoiceId &&
    data.issueDate &&
    data.subtotal !== undefined &&
    data.ivaAmount !== undefined &&
    data.totalAmount !== undefined &&
    data.previousHash &&
    data.softwareId
  );
}
