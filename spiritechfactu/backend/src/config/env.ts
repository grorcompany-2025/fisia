/**
 * env.ts - Configuración de variables de entorno
 * Centraliza todas las configuraciones del backend
 */

import dotenv from 'dotenv';

// Cargar variables de entorno desde .env
dotenv.config();

// ============================================================================
// CONFIGURACIÓN GENERAL
// ============================================================================

export const ENV = process.env.NODE_ENV || 'development';
export const PORT = parseInt(process.env.PORT || '3000', 10);
export const HOST = process.env.HOST || 'localhost';

// ============================================================================
// CONFIGURACIÓN FIREBASE/FIRESTORE
// ============================================================================

// TODO: Configurar credenciales de Firebase
// Las credenciales se deben cargar desde un archivo JSON o variables de entorno
export const FIREBASE_PROJECT_ID = process.env.FIREBASE_PROJECT_ID || 'spiritechfactu';
export const FIREBASE_PRIVATE_KEY = process.env.FIREBASE_PRIVATE_KEY;
export const FIREBASE_CLIENT_EMAIL = process.env.FIREBASE_CLIENT_EMAIL;

// ============================================================================
// CONFIGURACIÓN SEGURIDAD
// ============================================================================

export const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:5173';
export const API_SECRET = process.env.API_SECRET || 'desarrollo-secret-key';

// ============================================================================
// CONFIGURACIÓN AEAT/VERIFACTU
// ============================================================================

// TODO: Configurar valores reales de AEAT
export const AEAT_SOAP_URL = process.env.AEAT_SOAP_URL || 'https://www.agenciatributaria.gob.es/webservices/VeriFactu/VeriFactuWebService.asmx';
export const AEAT_CERTIFICATE_PATH = process.env.AEAT_CERTIFICATE_PATH;
export const AEAT_CERTIFICATE_PASSWORD = process.env.AEAT_CERTIFICATE_PASSWORD;

// ============================================================================
// CONFIGURACIÓN VERIFACTU
// ============================================================================

export const VERIFACTU_MODE = (process.env.VERIFACTU_MODE || 'testing') as 'testing' | 'production';
export const HASH_ALGORITHM = (process.env.HASH_ALGORITHM || 'SHA256') as 'SHA256' | 'SHA512';
export const SOFTWARE_ID = process.env.SOFTWARE_ID || 'SpiritechFactu_v1';
export const SOFTWARE_VERSION = process.env.SOFTWARE_VERSION || '1.0.0';

// ============================================================================
// CONFIGURACIÓN PDF
// ============================================================================

export const PDF_MARGIN = parseInt(process.env.PDF_MARGIN || '40', 10);
export const PDF_FONT_SIZE = parseInt(process.env.PDF_FONT_SIZE || '12', 10);

// ============================================================================
// VALIDACIÓN DE CONFIGURACIÓN
// ============================================================================

/**
 * Valida que la configuración sea correcta
 * @throws Error si hay configuración faltante
 */
export function validateConfig(): void {
  const requiredEnvVars = ['NODE_ENV'];

  const missing = requiredEnvVars.filter((v) => !process.env[v]);

  if (missing.length > 0) {
    console.error('Variables de entorno faltantes:', missing.join(', '));
  }

  // Advertencias para producción
  if (ENV === 'production') {
    const productionVars = ['FIREBASE_PROJECT_ID', 'FIREBASE_PRIVATE_KEY', 'FIREBASE_CLIENT_EMAIL'];
    const missingProduction = productionVars.filter((v) => !process.env[v]);

    if (missingProduction.length > 0) {
      console.warn('⚠️  Advertencia: Variables de entorno faltantes para producción:', missingProduction.join(', '));
    }

    if (API_SECRET === 'desarrollo-secret-key') {
      console.warn('⚠️  Advertencia: API_SECRET debe cambiarse en producción');
    }
  }
}

/**
 * Obtiene un resumen de la configuración (sin información sensible)
 */
export function getConfigSummary() {
  return {
    environment: ENV,
    port: PORT,
    host: HOST,
    verifactuMode: VERIFACTU_MODE,
    hashAlgorithm: HASH_ALGORITHM,
    softwareId: SOFTWARE_ID,
  };
}
