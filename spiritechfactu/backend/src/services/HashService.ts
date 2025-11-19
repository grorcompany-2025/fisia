/**
 * HashService.ts - Servicio de cálculo de hashes encadenados para integridad fiscal
 * Implementa cumplimiento AEAT SIF: integridad, inalterabilidad, infalsificabilidad
 */

import crypto from 'crypto';
import { HashCalculationInput } from '../models/types';
import { HASH_ALGORITHM } from '../config/env';

export class HashService {
  /**
   * Calcula el hash SHA256/SHA512 de los datos de una factura
   * Esto es crítico para cumplimiento VeriFactu
   *
   * El hash encadenado es la base de la integridad fiscal:
   * - Cada factura tiene un hash que depende de su contenido
   * - Y del hash de la factura anterior (encadenamiento)
   * - Imposible modificar una factura sin que se detecte
   *
   * @param input - Datos para calcular el hash
   * @returns Hash hexadecimal
   */
  static calculateHash(input: HashCalculationInput): string {
    // Construir un string determinístico con los datos críticos
    // El orden es importante para reproducibilidad
    const hashInput = [
      input.invoiceId,
      input.issueDate,
      input.subtotal.toFixed(2),
      input.ivaAmount.toFixed(2),
      input.totalAmount.toFixed(2),
      input.previousHash,
      input.softwareId,
    ].join('|');

    // Usar el algoritmo configurado (SHA256 o SHA512)
    const algorithm = HASH_ALGORITHM.toLowerCase();
    const hash = crypto.createHash(algorithm).update(hashInput).digest('hex');

    return hash;
  }

  /**
   * Verifica que un hash sea válido para unos datos específicos
   * Se usa para auditar integridad de facturas
   *
   * @param input - Datos para recalcular el hash
   * @param expectedHash - Hash que esperamos
   * @returns true si el hash es válido
   */
  static verifyHash(input: HashCalculationInput, expectedHash: string): boolean {
    const calculatedHash = this.calculateHash(input);
    return calculatedHash === expectedHash;
  }

  /**
   * Genera el hash inicial (para la primera factura del período)
   * Cuando no hay factura anterior, usamos un valor conocido
   *
   * @param softwareId - ID del software
   * @returns Hash inicial
   */
  static generateInitialHash(softwareId: string): string {
    const initialInput = `INITIAL|${softwareId}`;
    const algorithm = HASH_ALGORITHM.toLowerCase();
    return crypto.createHash(algorithm).update(initialInput).digest('hex');
  }

  /**
   * Calcula el hash de una cadena genérica
   * Útil para otros usos
   *
   * @param data - Datos a hashear
   * @returns Hash hexadecimal
   */
  static hashString(data: string): string {
    const algorithm = HASH_ALGORITHM.toLowerCase();
    return crypto.createHash(algorithm).update(data).digest('hex');
  }

  /**
   * Calcula el hash de un objeto (convertido a JSON)
   * Usado para verificar integridad de estructuras complejas
   *
   * @param obj - Objeto a hashear
   * @returns Hash hexadecimal
   */
  static hashObject(obj: any): string {
    // Usar JSON.stringify con replacer para garantizar orden consistent
    const jsonString = JSON.stringify(obj, Object.keys(obj).sort());
    return this.hashString(jsonString);
  }

  /**
   * Genera un hash HMAC para autenticación/firma rápida
   * TODO: En producción, usar certificado de firma digital real
   *
   * @param data - Datos a firmar
   * @param secret - Clave secreta
   * @returns HMAC hexadecimal
   */
  static generateHMAC(data: string, secret: string): string {
    return crypto.createHmac(HASH_ALGORITHM.toLowerCase(), secret).update(data).digest('hex');
  }

  /**
   * Verifica un HMAC
   * @param data - Datos originales
   * @param secret - Clave secreta
   * @param providedHmac - HMAC que verificar
   * @returns boolean
   */
  static verifyHMAC(data: string, secret: string, providedHmac: string): boolean {
    const calculatedHmac = this.generateHMAC(data, secret);
    // Usar comparación constante para evitar timing attacks
    return crypto.timingSafeEqual(
      Buffer.from(calculatedHmac),
      Buffer.from(providedHmac)
    );
  }

  /**
   * Obtiene el algoritmo hash actual
   * @returns Algoritmo configurado
   */
  static getAlgorithm(): string {
    return HASH_ALGORITHM;
  }
}
