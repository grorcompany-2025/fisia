/**
 * InvoicesPage.jsx - Página de listado de facturas
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { invoicesAPI, getCurrentCompany } from '../api';
import { Plus, Download, Trash2 } from 'lucide-react';

function InvoicesPage() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadInvoices();
  }, []);

  async function loadInvoices() {
    try {
      const companyId = getCurrentCompany();
      if (!companyId) return;

      const response = await invoicesAPI.list(companyId);
      setInvoices(response.data?.data || []);
    } catch (error) {
      console.error('Error loading invoices:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDownloadPdf(id, invoiceNumber) {
    try {
      await invoicesAPI.downloadPdf(id, `Factura_${invoiceNumber}.pdf`);
    } catch (error) {
      console.error('Error downloading PDF:', error);
    }
  }

  const filteredInvoices = filter === 'all' ? invoices : invoices.filter((inv) => inv.status === filter);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: 'var(--spacing-xl)' }}>
        <div className="spinner"></div>
        <p>Cargando facturas...</p>
      </div>
    );
  }

  return (
    <div>
      {/* Encabezado */}
      <div style={{ marginBottom: 'var(--spacing-xl)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1>Facturas</h1>
            <p style={{ color: 'var(--color-text-secondary)' }}>
              Gestiona tus facturas y cumplimiento VeriFactu
            </p>
          </div>
          <Link
            to="/invoices/new"
            className="btn btn-primary"
          >
            <Plus size={20} />
            Nueva Factura
          </Link>
        </div>
      </div>

      {/* Filtros */}
      <div style={{ marginBottom: 'var(--spacing-lg)' }}>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={{ padding: 'var(--spacing-sm)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}
        >
          <option value="all">Todas</option>
          <option value="draft">Borradores</option>
          <option value="issued">Emitidas</option>
          <option value="paid">Pagadas</option>
          <option value="cancelled">Canceladas</option>
        </select>
      </div>

      {/* Tabla */}
      <div className="card">
        {filteredInvoices.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 'var(--spacing-xl)', color: 'var(--color-text-secondary)' }}>
            <p>No hay facturas con este filtro</p>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Número</th>
                <th>Cliente</th>
                <th>Fecha</th>
                <th>Total</th>
                <th>Estado</th>
                <th>VeriFactu</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredInvoices.map((inv) => (
                <tr key={inv.id}>
                  <td>
                    <Link
                      to={`/invoices/${inv.id}`}
                      style={{ color: 'var(--color-primary)', textDecoration: 'none', fontWeight: 500 }}
                    >
                      {inv.invoiceNumber}
                    </Link>
                  </td>
                  <td>{inv.customerId}</td>
                  <td>{new Date(inv.issueDate).toLocaleDateString('es-ES')}</td>
                  <td>€ {inv.totalAmount.toFixed(2)}</td>
                  <td>
                    <span
                      className={`badge badge-${
                        inv.status === 'draft'
                          ? 'warning'
                          : inv.status === 'paid'
                          ? 'success'
                          : inv.status === 'cancelled'
                          ? 'danger'
                          : 'primary'
                      }`}
                    >
                      {inv.status}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`badge badge-${
                        inv.verifactuStatus === 'sent' ? 'info' : inv.verifactuStatus === 'confirmed' ? 'success' : 'warning'
                      }`}
                    >
                      {inv.verifactuStatus}
                    </span>
                  </td>
                  <td>
                    <button
                      onClick={() => handleDownloadPdf(inv.id, inv.invoiceNumber)}
                      className="btn btn-small btn-secondary"
                      title="Descargar PDF"
                    >
                      <Download size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default InvoicesPage;
