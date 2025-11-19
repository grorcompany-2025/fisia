/**
 * errors.ts - Gestión centralizada de errores personalizados
 */

import { CustomError } from '../models/types';

// ============================================================================
// CLASES DE ERROR
// ============================================================================

/**
 * Error personalizado base para la aplicación
 */
export class AppError extends Error implements CustomError {
  code: string;
  statusCode: number;
  details?: string;

  constructor(message: string, code: string, statusCode: number = 400, details?: string) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;

    // Mantiene el prototipo correcto en TypeScript
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

/**
 * Error de validación
 */
export class ValidationError extends AppError {
  constructor(message: string, details?: string) {
    super(message, 'VALIDATION_ERROR', 400, details);
    this.name = 'ValidationError';
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}

/**
 * Error de recurso no encontrado
 */
export class NotFoundError extends AppError {
  constructor(resource: string, identifier: string) {
    const message = `${resource} con ID "${identifier}" no encontrado`;
    super(message, 'NOT_FOUND', 404);
    this.name = 'NotFoundError';
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}

/**
 * Error de autorización/permiso denegado
 */
export class UnauthorizedError extends AppError {
  constructor(message: string = 'No autorizado') {
    super(message, 'UNAUTHORIZED', 401);
    this.name = 'UnauthorizedError';
    Object.setPrototypeOf(this, UnauthorizedError.prototype);
  }
}

/**
 * Error de acceso denegado
 */
export class ForbiddenError extends AppError {
  constructor(message: string = 'Acceso denegado') {
    super(message, 'FORBIDDEN', 403);
    this.name = 'ForbiddenError';
    Object.setPrototypeOf(this, ForbiddenError.prototype);
  }
}

/**
 * Error de conflicto (ej: registro duplicado)
 */
export class ConflictError extends AppError {
  constructor(resource: string, reason: string) {
    const message = `Conflicto: ${resource} - ${reason}`;
    super(message, 'CONFLICT', 409);
    this.name = 'ConflictError';
    Object.setPrototypeOf(this, ConflictError.prototype);
  }
}

/**
 * Error de VeriFactu
 */
export class VerifactuError extends AppError {
  constructor(message: string, code: string = 'VERIFACTU_ERROR', details?: string) {
    super(message, code, 422, details);
    this.name = 'VerifactuError';
    Object.setPrototypeOf(this, VerifactuError.prototype);
  }
}

/**
 * Error de base de datos
 */
export class DatabaseError extends AppError {
  constructor(message: string, details?: string) {
    super(message, 'DATABASE_ERROR', 500, details);
    this.name = 'DatabaseError';
    Object.setPrototypeOf(this, DatabaseError.prototype);
  }
}

/**
 * Error de servicio externo
 */
export class ExternalServiceError extends AppError {
  constructor(service: string, message: string, details?: string) {
    const msg = `Error en servicio externo (${service}): ${message}`;
    super(msg, 'EXTERNAL_SERVICE_ERROR', 502, details);
    this.name = 'ExternalServiceError';
    Object.setPrototypeOf(this, ExternalServiceError.prototype);
  }
}

// ============================================================================
// FUNCIONES AUXILIARES
// ============================================================================

/**
 * Determina si un error es una instancia de AppError
 * @param error - Error a verificar
 * @returns boolean
 */
export function isAppError(error: any): error is AppError {
  return error instanceof AppError;
}

/**
 * Obtiene los detalles de error como objeto
 * @param error - Error de cualquier tipo
 * @returns Objeto con code, message, details
 */
export function getErrorDetails(error: any) {
  if (isAppError(error)) {
    return {
      code: error.code,
      message: error.message,
      statusCode: error.statusCode,
      details: error.details,
    };
  }

  if (error instanceof Error) {
    return {
      code: 'INTERNAL_ERROR',
      message: error.message,
      statusCode: 500,
    };
  }

  return {
    code: 'UNKNOWN_ERROR',
    message: 'Ocurrió un error desconocido',
    statusCode: 500,
  };
}
