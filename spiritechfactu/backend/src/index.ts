/**
 * index.ts - Servidor Express principal
 * Puntos de entrada API, configuración CORS, manejo de errores global
 *
 * Rutas principales:
 * POST   /api/companies              - Crear empresa
 * GET    /api/companies/:id          - Obtener empresa
 * PUT    /api/companies/:id          - Actualizar empresa
 *
 * POST   /api/customers              - Crear cliente
 * GET    /api/customers              - Listar clientes de empresa
 * GET    /api/customers/:id          - Obtener cliente
 * PUT    /api/customers/:id          - Actualizar cliente
 * DELETE /api/customers/:id          - Eliminar cliente
 *
 * POST   /api/invoices               - Crear factura (borrador)
 * GET    /api/invoices               - Listar facturas
 * GET    /api/invoices/:id           - Obtener factura
 * PUT    /api/invoices/:id           - Actualizar factura (solo borrador)
 * POST   /api/invoices/:id/issue     - Emitir factura
 * POST   /api/invoices/:id/cancel    - Cancelar factura
 * POST   /api/invoices/:id/pdf       - Generar PDF
 * GET    /api/invoices/:id/pdf       - Descargar PDF
 *
 * POST   /api/verifactu/:invoiceId   - Enviar a VeriFactu
 * GET    /api/verifactu/:invoiceId   - Estado VeriFactu
 *
 * Health & Info:
 * GET    /health                     - Estado del servidor
 * GET    /api/config                 - Configuración (sin datos sensibles)
 */

import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';

// Importar configuración y utilidades
import { PORT, HOST, CORS_ORIGIN, validateConfig, getConfigSummary } from './config/env';
import { AppError, isAppError, getErrorDetails, ValidationError, NotFoundError } from './utils/errors';
import { validateWithSchema, companySchema, customerSchema, invoiceSchema, invoiceLineSchema } from './utils/validation';

// Importar servicios
import { InvoiceService } from './services/InvoiceService';
import { HashService } from './services/HashService';
import { VerifactuService } from './services/VerifactuService';
import { PdfService } from './services/PdfService';

// Importar tipos
import { Company, Customer, Invoice, InvoiceLine, ApiResponse } from './models/types';
import { SOFTWARE_ID } from './config/env';

// Cargar variables de entorno
dotenv.config();

// ============================================================================
// INICIALIZAR EXPRESS
// ============================================================================

const app: Express = express();

// Middlewares
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(cors({ origin: CORS_ORIGIN }));

// ============================================================================
// ALMACENAMIENTO EN MEMORIA (Simulación de Firestore para desarrollo)
// TODO: Reemplazar con conexión real a Firestore
// ============================================================================

interface DataStore {
  companies: Map<string, Company>;
  customers: Map<string, Customer>;
  invoices: Map<string, Invoice>;
  lastInvoiceHashes: Map<string, string>; // Último hash por empresa
}

const dataStore: DataStore = {
  companies: new Map(),
  customers: new Map(),
  invoices: new Map(),
  lastInvoiceHashes: new Map(),
};

// ============================================================================
// FUNCIONES AUXILIARES
// ============================================================================

/**
 * Obtiene el último hash para una empresa
 * Necesario para encadenamiento
 */
function getLastHashForCompany(companyId: string): string {
  return dataStore.lastInvoiceHashes.get(companyId) || HashService.generateInitialHash(SOFTWARE_ID);
}

/**
 * Actualiza el último hash de una empresa
 */
function updateLastHashForCompany(companyId: string, hash: string): void {
  dataStore.lastInvoiceHashes.set(companyId, hash);
}

/**
 * Formatea respuesta API
 */
function sendResponse<T>(res: Response, statusCode: number, data: T, message?: string): void {
  const response: ApiResponse<T> = {
    success: statusCode >= 200 && statusCode < 300,
    data: statusCode >= 200 && statusCode < 300 ? data : undefined,
    error: statusCode >= 400 ? {
      code: 'API_ERROR',
      message: message || 'Error en la solicitud',
    } : undefined,
    timestamp: new Date(),
  };
  res.status(statusCode).json(response);
}

// ============================================================================
// RUTAS: HEALTH & INFO
// ============================================================================

app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date(),
    uptime: process.uptime(),
  });
});

app.get('/api/config', (req: Request, res: Response) => {
  res.status(200).json(getConfigSummary());
});

// ============================================================================
// RUTAS: EMPRESAS
// ============================================================================

/**
 * POST /api/companies - Crear nueva empresa
 */
app.post('/api/companies', (req: Request, res: Response, next: NextFunction) => {
  try {
    const { valid, error, value } = validateWithSchema(req.body, companySchema);
    if (!valid) {
      return sendResponse(res, 400, null, error);
    }

    const company: Company = {
      id: uuidv4(),
      ...value,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    dataStore.companies.set(company.id, company);
    // Inicializar hash para esta empresa
    dataStore.lastInvoiceHashes.set(company.id, HashService.generateInitialHash(SOFTWARE_ID));

    sendResponse(res, 201, company);
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/companies/:id - Obtener empresa
 */
app.get('/api/companies/:id', (req: Request, res: Response, next: NextFunction) => {
  try {
    const company = dataStore.companies.get(req.params.id);
    if (!company) {
      throw new NotFoundError('Company', req.params.id);
    }
    sendResponse(res, 200, company);
  } catch (error) {
    next(error);
  }
});

/**
 * PUT /api/companies/:id - Actualizar empresa
 */
app.put('/api/companies/:id', (req: Request, res: Response, next: NextFunction) => {
  try {
    const company = dataStore.companies.get(req.params.id);
    if (!company) {
      throw new NotFoundError('Company', req.params.id);
    }

    const { valid, error, value } = validateWithSchema(req.body, companySchema);
    if (!valid) {
      return sendResponse(res, 400, null, error);
    }

    const updated: Company = {
      ...company,
      ...value,
      updatedAt: new Date(),
    };

    dataStore.companies.set(company.id, updated);
    sendResponse(res, 200, updated);
  } catch (error) {
    next(error);
  }
});

// ============================================================================
// RUTAS: CLIENTES
// ============================================================================

/**
 * POST /api/customers - Crear cliente
 */
app.post('/api/customers', (req: Request, res: Response, next: NextFunction) => {
  try {
    // Obtener companyId del body o headers
    const companyId = req.body.companyId || req.headers['x-company-id'];
    if (!companyId) {
      throw new ValidationError('companyId es requerido');
    }

    const company = dataStore.companies.get(companyId as string);
    if (!company) {
      throw new NotFoundError('Company', companyId as string);
    }

    const { valid, error, value } = validateWithSchema(req.body, customerSchema);
    if (!valid) {
      return sendResponse(res, 400, null, error);
    }

    const customer: Customer = {
      id: uuidv4(),
      companyId: companyId as string,
      ...value,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    dataStore.customers.set(customer.id, customer);
    sendResponse(res, 201, customer);
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/customers - Listar clientes de una empresa
 */
app.get('/api/customers', (req: Request, res: Response, next: NextFunction) => {
  try {
    const companyId = req.query.companyId || req.headers['x-company-id'];
    if (!companyId) {
      throw new ValidationError('companyId es requerido');
    }

    const customers = Array.from(dataStore.customers.values()).filter(
      (c) => c.companyId === companyId
    );

    res.status(200).json({
      success: true,
      data: customers,
      timestamp: new Date(),
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/customers/:id - Obtener cliente
 */
app.get('/api/customers/:id', (req: Request, res: Response, next: NextFunction) => {
  try {
    const customer = dataStore.customers.get(req.params.id);
    if (!customer) {
      throw new NotFoundError('Customer', req.params.id);
    }
    sendResponse(res, 200, customer);
  } catch (error) {
    next(error);
  }
});

/**
 * PUT /api/customers/:id - Actualizar cliente
 */
app.put('/api/customers/:id', (req: Request, res: Response, next: NextFunction) => {
  try {
    const customer = dataStore.customers.get(req.params.id);
    if (!customer) {
      throw new NotFoundError('Customer', req.params.id);
    }

    const { valid, error, value } = validateWithSchema(req.body, customerSchema);
    if (!valid) {
      return sendResponse(res, 400, null, error);
    }

    const updated: Customer = {
      ...customer,
      ...value,
      updatedAt: new Date(),
    };

    dataStore.customers.set(customer.id, updated);
    sendResponse(res, 200, updated);
  } catch (error) {
    next(error);
  }
});

/**
 * DELETE /api/customers/:id - Eliminar cliente
 */
app.delete('/api/customers/:id', (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!dataStore.customers.has(req.params.id)) {
      throw new NotFoundError('Customer', req.params.id);
    }

    dataStore.customers.delete(req.params.id);
    sendResponse(res, 200, { message: 'Cliente eliminado' });
  } catch (error) {
    next(error);
  }
});

// ============================================================================
// RUTAS: FACTURAS
// ============================================================================

/**
 * POST /api/invoices - Crear factura (borrador)
 */
app.post('/api/invoices', (req: Request, res: Response, next: NextFunction) => {
  try {
    const { companyId, customerId, invoiceNumber, issueDate, dueDate, lines, notes, paymentMethod, userId = 'system' } = req.body;

    // Validaciones
    if (!companyId || !customerId) {
      throw new ValidationError('companyId y customerId son requeridos');
    }

    if (!dataStore.companies.has(companyId)) {
      throw new NotFoundError('Company', companyId);
    }

    if (!dataStore.customers.has(customerId)) {
      throw new NotFoundError('Customer', customerId);
    }

    // Validar líneas
    if (!lines || !Array.isArray(lines) || lines.length === 0) {
      throw new ValidationError('Debe haber al menos una línea en la factura');
    }

    for (const line of lines) {
      const { valid, error } = validateWithSchema(line, invoiceLineSchema);
      if (!valid) {
        throw new ValidationError(`Error en línea: ${error}`);
      }
    }

    // Crear factura
    const invoice = InvoiceService.createInvoice(
      invoiceNumber,
      customerId,
      companyId,
      lines as InvoiceLine[],
      { issueDate: new Date(issueDate), dueDate: new Date(dueDate) },
      userId
    );

    if (notes) invoice.notes = notes;
    if (paymentMethod) invoice.paymentMethod = paymentMethod;

    dataStore.invoices.set(invoice.id, invoice);
    sendResponse(res, 201, invoice);
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/invoices - Listar facturas
 */
app.get('/api/invoices', (req: Request, res: Response, next: NextFunction) => {
  try {
    const companyId = req.query.companyId;
    let invoices = Array.from(dataStore.invoices.values());

    if (companyId) {
      invoices = invoices.filter((i) => i.companyId === companyId);
    }

    res.status(200).json({
      success: true,
      data: invoices,
      timestamp: new Date(),
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/invoices/:id - Obtener factura
 */
app.get('/api/invoices/:id', (req: Request, res: Response, next: NextFunction) => {
  try {
    const invoice = dataStore.invoices.get(req.params.id);
    if (!invoice) {
      throw new NotFoundError('Invoice', req.params.id);
    }
    sendResponse(res, 200, invoice);
  } catch (error) {
    next(error);
  }
});

/**
 * PUT /api/invoices/:id - Actualizar factura (solo borrador)
 */
app.put('/api/invoices/:id', (req: Request, res: Response, next: NextFunction) => {
  try {
    const invoice = dataStore.invoices.get(req.params.id);
    if (!invoice) {
      throw new NotFoundError('Invoice', req.params.id);
    }

    if (invoice.status !== 'draft') {
      throw new ValidationError('Solo se pueden editar facturas en borrador');
    }

    const { lines, notes, paymentMethod, dueDate } = req.body;

    if (lines) {
      invoice.lines = lines;
      const totals = InvoiceService.calculateTotals(lines);
      invoice.subtotal = totals.subtotal;
      invoice.ivaAmount = totals.ivaAmount;
      invoice.totalAmount = totals.totalAmount;
    }

    if (notes !== undefined) invoice.notes = notes;
    if (paymentMethod !== undefined) invoice.paymentMethod = paymentMethod;
    if (dueDate !== undefined) invoice.dueDate = new Date(dueDate);

    invoice.updatedAt = new Date();
    dataStore.invoices.set(invoice.id, invoice);

    sendResponse(res, 200, invoice);
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/invoices/:id/issue - Emitir factura
 */
app.post('/api/invoices/:id/issue', (req: Request, res: Response, next: NextFunction) => {
  try {
    const invoice = dataStore.invoices.get(req.params.id);
    if (!invoice) {
      throw new NotFoundError('Invoice', req.params.id);
    }

    const previousHash = getLastHashForCompany(invoice.companyId);
    const issued = InvoiceService.issueInvoice(invoice, previousHash, SOFTWARE_ID);

    updateLastHashForCompany(invoice.companyId, issued.hashCurrent);
    dataStore.invoices.set(invoice.id, issued);

    sendResponse(res, 200, issued);
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/invoices/:id/cancel - Cancelar factura
 */
app.post('/api/invoices/:id/cancel', (req: Request, res: Response, next: NextFunction) => {
  try {
    const invoice = dataStore.invoices.get(req.params.id);
    if (!invoice) {
      throw new NotFoundError('Invoice', req.params.id);
    }

    const { userId = 'system' } = req.body;
    const cancelled = InvoiceService.cancelInvoice(invoice, userId);
    dataStore.invoices.set(invoice.id, cancelled);

    sendResponse(res, 200, cancelled);
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/invoices/:id/pdf - Generar PDF
 */
app.post('/api/invoices/:id/pdf', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const invoice = dataStore.invoices.get(req.params.id);
    if (!invoice) {
      throw new NotFoundError('Invoice', req.params.id);
    }

    const company = dataStore.companies.get(invoice.companyId);
    const customer = dataStore.customers.get(invoice.customerId);

    if (!company || !customer) {
      throw new ValidationError('Datos de empresa o cliente incompletos');
    }

    // Generar QR con datos de la factura
    // TODO: Usar librería QR real
    const qrData = `INV|${invoice.invoiceNumber}|${invoice.totalAmount}|${invoice.hashCurrent.substring(0, 16)}`;
    const qrDataUrl = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='; // Placeholder

    const pdfBuffer = await PdfService.generateInvoicePdf(invoice, company, customer, qrDataUrl);

    // Guardar en memoria (en producción, guardar en storage)
    invoice.qrDataUrl = qrDataUrl;
    dataStore.invoices.set(invoice.id, invoice);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="Factura_${invoice.invoiceNumber}.pdf"`);
    res.send(pdfBuffer);
  } catch (error) {
    next(error);
  }
});

// ============================================================================
// RUTAS: VERIFACTU
// ============================================================================

/**
 * POST /api/verifactu/:invoiceId - Enviar factura a VeriFactu
 */
app.post('/api/verifactu/:invoiceId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const invoice = dataStore.invoices.get(req.params.invoiceId);
    if (!invoice) {
      throw new NotFoundError('Invoice', req.params.invoiceId);
    }

    const company = dataStore.companies.get(invoice.companyId);
    const customer = dataStore.customers.get(invoice.customerId);

    if (!company || !customer) {
      throw new ValidationError('Datos de empresa o cliente incompletos');
    }

    // Generar XML VeriFactu
    const previousHash = getLastHashForCompany(invoice.companyId);
    const xmlContent = VerifactuService.generateAltaXml({
      invoice,
      company,
      customer,
      previousHash,
    });

    // Guardar XML
    invoice.xmlContent = xmlContent;
    invoice.verifactuStatus = 'sent';

    // TODO: Enviar a AEAT real
    const soapRequest = VerifactuService.generateSOAPRequest(xmlContent, company);
    const aeatResponse = await VerifactuService.sendToAEAT(soapRequest);

    invoice.verifactuResponseId = aeatResponse.registroId;
    dataStore.invoices.set(invoice.id, invoice);

    sendResponse(res, 200, {
      invoice,
      xml: xmlContent,
      aeatResponse,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/verifactu/:invoiceId - Obtener estado VeriFactu
 */
app.get('/api/verifactu/:invoiceId', (req: Request, res: Response, next: NextFunction) => {
  try {
    const invoice = dataStore.invoices.get(req.params.invoiceId);
    if (!invoice) {
      throw new NotFoundError('Invoice', req.params.invoiceId);
    }

    sendResponse(res, 200, {
      invoiceId: invoice.id,
      verifactuStatus: invoice.verifactuStatus,
      verifactuResponseId: invoice.verifactuResponseId,
      hashCurrent: invoice.hashCurrent,
    });
  } catch (error) {
    next(error);
  }
});

// ============================================================================
// MANEJO GLOBAL DE ERRORES
// ============================================================================

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  const errorDetails = getErrorDetails(err);

  console.error(`[${new Date().toISOString()}] Error:`, {
    code: errorDetails.code,
    message: errorDetails.message,
    path: req.path,
    method: req.method,
  });

  sendResponse(res, errorDetails.statusCode, null, errorDetails.message);
});

// ============================================================================
// 404 - Ruta no encontrada
// ============================================================================

app.use((req: Request, res: Response) => {
  sendResponse(res, 404, null, `Ruta no encontrada: ${req.method} ${req.path}`);
});

// ============================================================================
// INICIAR SERVIDOR
// ============================================================================

function startServer(): void {
  try {
    validateConfig();

    app.listen(PORT, HOST, () => {
      console.log(`
╔════════════════════════════════════════════════════════╗
║           🧾 SpiritechFactu - Backend v1.0             ║
╚════════════════════════════════════════════════════════╝

✅ Servidor iniciado correctamente

📍 URL: http://${HOST}:${PORT}
🌍 CORS: ${CORS_ORIGIN}
⚙️  Entorno: ${process.env.NODE_ENV || 'development'}
🔐 VeriFactu: ${process.env.VERIFACTU_MODE || 'testing'}

📚 API Documentation:
  GET  /health                    - Estado del servidor
  GET  /api/config                - Configuración

  POST /api/companies             - Crear empresa
  GET  /api/companies/:id         - Obtener empresa

  POST /api/customers             - Crear cliente
  GET  /api/customers             - Listar clientes

  POST /api/invoices              - Crear factura
  GET  /api/invoices              - Listar facturas
  POST /api/invoices/:id/issue    - Emitir factura
  POST /api/invoices/:id/pdf      - Generar PDF

  POST /api/verifactu/:id         - Enviar a VeriFactu

⚠️  [TODO] Configurar Firebase/Firestore
⚠️  [TODO] Implementar autenticación JWT
⚠️  [TODO] Conectar con AEAT real (certificado digital)

`);
    });
  } catch (error) {
    console.error('❌ Error al iniciar el servidor:', error);
    process.exit(1);
  }
}

startServer();

export default app;
