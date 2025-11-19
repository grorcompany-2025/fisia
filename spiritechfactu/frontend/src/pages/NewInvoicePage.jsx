/**
 * NewInvoicePage.jsx - Página para crear nueva factura
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { invoicesAPI, customersAPI, getCurrentCompany } from '../api';
import { Plus, Trash2 } from 'lucide-react';

function NewInvoicePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    invoiceNumber: '',
    customerId: '',
    issueDate: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    paymentMethod: 'Transferencia',
    notes: '',
    lines: [{ description: '', quantity: 1, unitPrice: 0, ivaRate: 21, discount: 0 }],
  });

  async function handleCreateInvoice(e) {
    e.preventDefault();
    setLoading(true);

    try {
      const companyId = getCurrentCompany();
      const response = await invoicesAPI.create({
        ...form,
        companyId,
        userId: 'current-user',
      });

      navigate(`/invoices/${response.data.data.id}`);
    } catch (error) {
      console.error('Error creating invoice:', error);
      alert('Error al crear la factura');
    } finally {
      setLoading(false);
    }
  }

  function handleAddLine() {
    setForm({
      ...form,
      lines: [...form.lines, { description: '', quantity: 1, unitPrice: 0, ivaRate: 21, discount: 0 }],
    });
  }

  function handleRemoveLine(index) {
    setForm({
      ...form,
      lines: form.lines.filter((_, i) => i !== index),
    });
  }

  function handleLineChange(index, field, value) {
    const newLines = [...form.lines];
    newLines[index][field] = field === 'quantity' || field === 'unitPrice' || field === 'ivaRate' || field === 'discount'
      ? parseFloat(value) || 0
      : value;
    setForm({ ...form, lines: newLines });
  }

  // Calcular totales
  const totals = form.lines.reduce(
    (acc, line) => {
      const subtotal = line.quantity * line.unitPrice * (1 - line.discount / 100);
      const iva = subtotal * (line.ivaRate / 100);
      acc.subtotal += subtotal;
      acc.iva += iva;
      return acc;
    },
    { subtotal: 0, iva: 0 }
  );

  const total = totals.subtotal + totals.iva;

  return (
    <div>
      <div style={{ marginBottom: 'var(--spacing-xl)' }}>
        <h1>Nueva Factura</h1>
        <p style={{ color: 'var(--color-text-secondary)' }}>
          Crea una nueva factura con cumplimiento VeriFactu
        </p>
      </div>

      <form onSubmit={handleCreateInvoice}>
        {/* Datos básicos */}
        <div className="card" style={{ marginBottom: 'var(--spacing-lg)' }}>
          <h3>Datos Básicos</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--spacing-md)' }}>
            <div>
              <label style={{ display: 'block', marginBottom: 'var(--spacing-sm)', fontWeight: 500 }}>
                Número de Factura *
              </label>
              <input
                type="text"
                required
                value={form.invoiceNumber}
                onChange={(e) => setForm({ ...form, invoiceNumber: e.target.value })}
                placeholder="Ej: INV-2024-001"
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: 'var(--spacing-sm)', fontWeight: 500 }}>
                Cliente *
              </label>
              <input
                type="text"
                required
                value={form.customerId}
                onChange={(e) => setForm({ ...form, customerId: e.target.value })}
                placeholder="ID del cliente"
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: 'var(--spacing-sm)', fontWeight: 500 }}>
                Fecha de Emisión *
              </label>
              <input
                type="date"
                required
                value={form.issueDate}
                onChange={(e) => setForm({ ...form, issueDate: e.target.value })}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: 'var(--spacing-sm)', fontWeight: 500 }}>
                Fecha de Vencimiento *
              </label>
              <input
                type="date"
                required
                value={form.dueDate}
                onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* Líneas de factura */}
        <div className="card" style={{ marginBottom: 'var(--spacing-lg)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-lg)' }}>
            <h3>Líneas de Factura</h3>
            <button
              type="button"
              className="btn btn-primary btn-small"
              onClick={handleAddLine}
            >
              <Plus size={16} />
              Añadir Línea
            </button>
          </div>

          {form.lines.map((line, index) => (
            <div
              key={index}
              style={{
                display: 'grid',
                gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr auto',
                gap: 'var(--spacing-md)',
                marginBottom: 'var(--spacing-md)',
                alignItems: 'flex-end',
              }}
            >
              <div>
                <label style={{ fontSize: 'var(--font-size-sm)' }}>Descripción</label>
                <input
                  type="text"
                  required
                  value={line.description}
                  onChange={(e) => handleLineChange(index, 'description', e.target.value)}
                  placeholder="Descripción del producto/servicio"
                />
              </div>
              <div>
                <label style={{ fontSize: 'var(--font-size-sm)' }}>Cantidad</label>
                <input
                  type="number"
                  required
                  step="0.01"
                  value={line.quantity}
                  onChange={(e) => handleLineChange(index, 'quantity', e.target.value)}
                />
              </div>
              <div>
                <label style={{ fontSize: 'var(--font-size-sm)' }}>Precio Unitario</label>
                <input
                  type="number"
                  required
                  step="0.01"
                  value={line.unitPrice}
                  onChange={(e) => handleLineChange(index, 'unitPrice', e.target.value)}
                />
              </div>
              <div>
                <label style={{ fontSize: 'var(--font-size-sm)' }}>IVA %</label>
                <select
                  value={line.ivaRate}
                  onChange={(e) => handleLineChange(index, 'ivaRate', e.target.value)}
                >
                  <option value="0">0%</option>
                  <option value="4">4%</option>
                  <option value="10">10%</option>
                  <option value="21">21%</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: 'var(--font-size-sm)' }}>Descuento %</label>
                <input
                  type="number"
                  step="0.01"
                  value={line.discount}
                  onChange={(e) => handleLineChange(index, 'discount', e.target.value)}
                />
              </div>
              <button
                type="button"
                className="btn btn-danger btn-small"
                onClick={() => handleRemoveLine(index)}
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>

        {/* Resumen */}
        <div className="card" style={{ marginBottom: 'var(--spacing-lg)' }}>
          <div style={{ textAlign: 'right' }}>
            <p style={{ marginBottom: 'var(--spacing-md)' }}>
              <strong>Subtotal:</strong> € {totals.subtotal.toFixed(2)}
            </p>
            <p style={{ marginBottom: 'var(--spacing-md)' }}>
              <strong>IVA:</strong> € {totals.iva.toFixed(2)}
            </p>
            <p style={{ fontSize: 'var(--font-size-xl)', fontWeight: 'bold', marginBottom: 0 }}>
              <strong>Total:</strong> € {total.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Notas */}
        <div className="card" style={{ marginBottom: 'var(--spacing-lg)' }}>
          <label style={{ display: 'block', marginBottom: 'var(--spacing-sm)', fontWeight: 500 }}>
            Notas (Opcional)
          </label>
          <textarea
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            placeholder="Notas o condiciones adicionales..."
          />
        </div>

        {/* Botones */}
        <div style={{ display: 'flex', gap: 'var(--spacing-md)', justifyContent: 'flex-end' }}>
          <button type="button" className="btn btn-secondary" onClick={() => navigate('/invoices')}>
            Cancelar
          </button>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Creando...' : 'Crear Factura'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default NewInvoicePage;
