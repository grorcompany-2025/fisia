/**
 * InvoiceDetailPage.jsx - Detalle y gestión de factura individual
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { invoicesAPI, verifactuAPI } from '../api';
import { Download, Send, X } from 'lucide-react';

function InvoiceDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInvoice();
  }, [id]);

  async function loadInvoice() {
    try {
      const response = await invoicesAPI.get(id);
      setInvoice(response.data.data);
    } catch (error) {
      console.error('Error loading invoice:', error);
      navigate('/invoices');
    } finally {
      setLoading(false);
    }
  }

  async function handleIssue() {
    try {
      const response = await invoicesAPI.issue(id);
      setInvoice(response.data.data);
      alert('Factura emitida correctamente');
    } catch (error) {
      console.error('Error issuing invoice:', error);
      alert('Error al emitir la factura');
    }
  }

  async function handleSendVerifactu() {
    try {
      const response = await verifactuAPI.send(id);
      setInvoice(response.data.data?.invoice || invoice);
      alert('Factura enviada a VeriFactu');
    } catch (error) {
      console.error('Error sending to VeriFactu:', error);
      alert('Error al enviar a VeriFactu');
    }
  }

  async function handleDownloadPdf() {
    try {
      await invoicesAPI.downloadPdf(id, `Factura_${invoice.invoiceNumber}.pdf`);
    } catch (error) {
      console.error('Error downloading PDF:', error);
      alert('Error al descargar PDF');
    }
  }

  async function handleCancel() {
    if (window.confirm('¿Estás seguro de que quieres cancelar esta factura?')) {
      try {
        const response = await invoicesAPI.cancel(id);
        setInvoice(response.data.data);
        alert('Factura cancelada correctamente');
      } catch (error) {
        console.error('Error cancelling invoice:', error);
        alert('Error al cancelar la factura');
      }
    }
  }

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: 'var(--spacing-xl)' }}>
        <div className="spinner"></div>
        <p>Cargando factura...</p>
      </div>
    );
  }

  if (!invoice) {
    return <p>Factura no encontrada</p>;
  }

  return (
    <div>
      {/* Encabezado */}
      <div style={{ marginBottom: 'var(--spacing-xl)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1>Factura {invoice.invoiceNumber}</h1>
            <p style={{ color: 'var(--color-text-secondary)' }}>
              Gestión y cumplimiento fiscal
            </p>
          </div>
          <div style={{ display: 'flex', gap: 'var(--spacing-md)' }}>
            <button
              className="btn btn-secondary btn-small"
              onClick={handleDownloadPdf}
            >
              <Download size={16} />
              PDF
            </button>
            {invoice.status === 'draft' && (
              <button
                className="btn btn-primary btn-small"
                onClick={handleIssue}
              >
                Emitir
              </button>
            )}
            {invoice.status === 'issued' && invoice.verifactuStatus === 'pending' && (
              <button
                className="btn btn-primary btn-small"
                onClick={handleSendVerifactu}
              >
                <Send size={16} />
                Enviar VeriFactu
              </button>
            )}
            {invoice.status !== 'cancelled' && (
              <button
                className="btn btn-danger btn-small"
                onClick={handleCancel}
              >
                <X size={16} />
                Cancelar
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Estados */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 'var(--spacing-md)',
          marginBottom: 'var(--spacing-xl)',
        }}
      >
        <div className="card">
          <p style={{ color: 'var(--color-text-secondary)', margin: 0, marginBottom: 'var(--spacing-xs)' }}>
            Estado
          </p>
          <p style={{ margin: 0, fontSize: 'var(--font-size-lg)', fontWeight: 600 }}>
            {invoice.status}
          </p>
        </div>
        <div className="card">
          <p style={{ color: 'var(--color-text-secondary)', margin: 0, marginBottom: 'var(--spacing-xs)' }}>
            VeriFactu
          </p>
          <p style={{ margin: 0, fontSize: 'var(--font-size-lg)', fontWeight: 600 }}>
            {invoice.verifactuStatus}
          </p>
        </div>
        <div className="card">
          <p style={{ color: 'var(--color-text-secondary)', margin: 0, marginBottom: 'var(--spacing-xs)' }}>
            Total
          </p>
          <p style={{ margin: 0, fontSize: 'var(--font-size-lg)', fontWeight: 600, color: 'var(--color-success)' }}>
            € {invoice.totalAmount.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Detalles */}
      <div className="card" style={{ marginBottom: 'var(--spacing-lg)' }}>
        <div className="card-header">
          <h3>Detalles de la Factura</h3>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-lg)' }}>
          <div>
            <p style={{ fontWeight: 500, marginBottom: 'var(--spacing-xs)' }}>Número:</p>
            <p>{invoice.invoiceNumber}</p>
            <p style={{ fontWeight: 500, marginBottom: 'var(--spacing-xs)', marginTop: 'var(--spacing-md)' }}>
              Fecha Emisión:
            </p>
            <p>{new Date(invoice.issueDate).toLocaleDateString('es-ES')}</p>
            <p style={{ fontWeight: 500, marginBottom: 'var(--spacing-xs)', marginTop: 'var(--spacing-md)' }}>
              Fecha Vencimiento:
            </p>
            <p>{new Date(invoice.dueDate).toLocaleDateString('es-ES')}</p>
          </div>
          <div>
            <p style={{ fontWeight: 500, marginBottom: 'var(--spacing-xs)' }}>Cliente ID:</p>
            <p>{invoice.customerId}</p>
            <p style={{ fontWeight: 500, marginBottom: 'var(--spacing-xs)', marginTop: 'var(--spacing-md)' }}>
              Método de Pago:
            </p>
            <p>{invoice.paymentMethod || 'No especificado'}</p>
          </div>
        </div>
      </div>

      {/* Líneas */}
      <div className="card" style={{ marginBottom: 'var(--spacing-lg)' }}>
        <div className="card-header">
          <h3>Líneas de Factura</h3>
        </div>

        <table>
          <thead>
            <tr>
              <th>Descripción</th>
              <th>Cantidad</th>
              <th>Precio Unitario</th>
              <th>Subtotal</th>
              <th>IVA %</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {invoice.lines.map((line) => (
              <tr key={line.id}>
                <td>{line.description}</td>
                <td>{line.quantity}</td>
                <td>€ {line.unitPrice.toFixed(2)}</td>
                <td>€ {line.subtotal.toFixed(2)}</td>
                <td>{line.ivaRate}%</td>
                <td>€ {line.total.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totales */}
      <div className="card" style={{ marginBottom: 'var(--spacing-lg)' }}>
        <div style={{ textAlign: 'right' }}>
          <p style={{ marginBottom: 'var(--spacing-md)' }}>
            <strong>Subtotal:</strong> € {invoice.subtotal.toFixed(2)}
          </p>
          <p style={{ marginBottom: 'var(--spacing-md)' }}>
            <strong>IVA:</strong> € {invoice.ivaAmount.toFixed(2)}
          </p>
          <p style={{ fontSize: 'var(--font-size-xl)', fontWeight: 'bold' }}>
            <strong>Total:</strong> € {invoice.totalAmount.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Hash VeriFactu */}
      {invoice.hashCurrent && (
        <div className="card">
          <div className="card-header">
            <h3>Cumplimiento VeriFactu</h3>
          </div>
          <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-md)' }}>
            <strong>Hash Actual (SHA256):</strong>
          </p>
          <p style={{
            wordBreak: 'break-all',
            fontFamily: 'monospace',
            fontSize: 'var(--font-size-sm)',
            backgroundColor: 'var(--color-bg-secondary)',
            padding: 'var(--spacing-md)',
            borderRadius: 'var(--radius-md)'
          }}>
            {invoice.hashCurrent}
          </p>
          <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', marginTop: 'var(--spacing-lg)', marginBottom: 'var(--spacing-md)' }}>
            <strong>Hash Anterior:</strong>
          </p>
          <p style={{
            wordBreak: 'break-all',
            fontFamily: 'monospace',
            fontSize: 'var(--font-size-sm)',
            backgroundColor: 'var(--color-bg-secondary)',
            padding: 'var(--spacing-md)',
            borderRadius: 'var(--radius-md)'
          }}>
            {invoice.hashPrevious}
          </p>
        </div>
      )}
    </div>
  );
}

export default InvoiceDetailPage;
