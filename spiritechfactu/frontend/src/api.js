/**
 * api.js - Cliente HTTP para comunicación con backend
 * Usa Axios con interceptores para manejo de errores
 */

import axios from 'axios';

// Crear instancia de axios
const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3000/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Obtener companyId del localStorage
function getCompanyId() {
  return localStorage.getItem('companyId') || '';
}

// Interceptor de request
apiClient.interceptors.request.use((config) => {
  const companyId = getCompanyId();
  if (companyId && !config.headers['X-Company-Id']) {
    config.headers['X-Company-Id'] = companyId;
  }
  return config;
});

// Interceptor de respuesta para manejo de errores
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.error?.message || error.message || 'Error desconocido';
    console.error('API Error:', message);
    return Promise.reject(error);
  }
);

// ============================================================================
// EMPRESAS
// ============================================================================

export const companiesAPI = {
  /**
   * Crear nueva empresa
   */
  create: (data) => apiClient.post('/companies', data),

  /**
   * Obtener empresa
   */
  get: (id) => apiClient.get(`/companies/${id}`),

  /**
   * Actualizar empresa
   */
  update: (id, data) => apiClient.put(`/companies/${id}`, data),
};

// ============================================================================
// CLIENTES
// ============================================================================

export const customersAPI = {
  /**
   * Crear cliente
   */
  create: (data) => apiClient.post('/customers', data),

  /**
   * Listar clientes
   */
  list: (companyId) =>
    apiClient.get('/customers', {
      params: { companyId },
    }),

  /**
   * Obtener cliente
   */
  get: (id) => apiClient.get(`/customers/${id}`),

  /**
   * Actualizar cliente
   */
  update: (id, data) => apiClient.put(`/customers/${id}`, data),

  /**
   * Eliminar cliente
   */
  delete: (id) => apiClient.delete(`/customers/${id}`),
};

// ============================================================================
// FACTURAS
// ============================================================================

export const invoicesAPI = {
  /**
   * Crear factura (borrador)
   */
  create: (data) => apiClient.post('/invoices', data),

  /**
   * Listar facturas
   */
  list: (companyId) =>
    apiClient.get('/invoices', {
      params: { companyId },
    }),

  /**
   * Obtener factura
   */
  get: (id) => apiClient.get(`/invoices/${id}`),

  /**
   * Actualizar factura
   */
  update: (id, data) => apiClient.put(`/invoices/${id}`, data),

  /**
   * Emitir factura
   */
  issue: (id) => apiClient.post(`/invoices/${id}/issue`),

  /**
   * Cancelar factura
   */
  cancel: (id) => apiClient.post(`/invoices/${id}/cancel`),

  /**
   * Generar PDF
   */
  generatePdf: (id) =>
    apiClient.post(`/invoices/${id}/pdf`, {}, { responseType: 'blob' }),

  /**
   * Descargar PDF
   */
  downloadPdf: (id, filename = 'factura.pdf') => {
    return invoicesAPI.generatePdf(id).then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.parentElement.removeChild(link);
    });
  },
};

// ============================================================================
// VERIFACTU
// ============================================================================

export const verifactuAPI = {
  /**
   * Enviar factura a VeriFactu
   */
  send: (invoiceId) => apiClient.post(`/verifactu/${invoiceId}`),

  /**
   * Obtener estado VeriFactu
   */
  getStatus: (invoiceId) => apiClient.get(`/verifactu/${invoiceId}`),
};

// ============================================================================
// FUNCIONES AUXILIARES
// ============================================================================

/**
 * Guarda el companyId en localStorage
 */
export function setCurrentCompany(companyId) {
  localStorage.setItem('companyId', companyId);
}

/**
 * Obtiene el companyId actual
 */
export function getCurrentCompany() {
  return localStorage.getItem('companyId');
}

/**
 * Limpia la empresa actual
 */
export function clearCurrentCompany() {
  localStorage.removeItem('companyId');
}

export default apiClient;
