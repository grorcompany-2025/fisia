/**
 * CustomersPage.jsx - Página de gestión de clientes
 */

import React, { useState, useEffect } from 'react';
import { customersAPI, getCurrentCompany } from '../api';
import { Plus, Edit2, Trash2 } from 'lucide-react';

function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    name: '',
    taxId: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
  });

  useEffect(() => {
    loadCustomers();
  }, []);

  async function loadCustomers() {
    try {
      const companyId = getCurrentCompany();
      if (!companyId) return;

      const response = await customersAPI.list(companyId);
      setCustomers(response.data?.data || []);
    } catch (error) {
      console.error('Error loading customers:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      if (editingId) {
        await customersAPI.update(editingId, form);
      } else {
        const companyId = getCurrentCompany();
        await customersAPI.create({
          ...form,
          companyId,
        });
      }

      setForm({
        name: '',
        taxId: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        postalCode: '',
      });
      setShowForm(false);
      setEditingId(null);
      loadCustomers();
    } catch (error) {
      console.error('Error saving customer:', error);
      alert('Error al guardar el cliente');
    }
  }

  async function handleDelete(id) {
    if (window.confirm('¿Estás seguro de que quieres eliminar este cliente?')) {
      try {
        await customersAPI.delete(id);
        loadCustomers();
      } catch (error) {
        console.error('Error deleting customer:', error);
        alert('Error al eliminar el cliente');
      }
    }
  }

  function handleEdit(customer) {
    setForm(customer);
    setEditingId(customer.id);
    setShowForm(true);
  }

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: 'var(--spacing-xl)' }}>
        <div className="spinner"></div>
        <p>Cargando clientes...</p>
      </div>
    );
  }

  return (
    <div>
      {/* Encabezado */}
      <div style={{ marginBottom: 'var(--spacing-xl)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1>Clientes</h1>
            <p style={{ color: 'var(--color-text-secondary)' }}>Gestiona tu cartera de clientes</p>
          </div>
          <button
            className="btn btn-primary"
            onClick={() => {
              setShowForm(!showForm);
              setEditingId(null);
              setForm({
                name: '',
                taxId: '',
                email: '',
                phone: '',
                address: '',
                city: '',
                postalCode: '',
              });
            }}
          >
            <Plus size={20} />
            Nuevo Cliente
          </button>
        </div>
      </div>

      {/* Formulario */}
      {showForm && (
        <div className="card" style={{ marginBottom: 'var(--spacing-lg)' }}>
          <h3>{editingId ? 'Editar Cliente' : 'Nuevo Cliente'}</h3>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--spacing-md)' }}>
              <div>
                <label style={{ display: 'block', marginBottom: 'var(--spacing-sm)', fontWeight: 500 }}>
                  Nombre *
                </label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: 'var(--spacing-sm)', fontWeight: 500 }}>
                  CIF/NIF
                </label>
                <input
                  type="text"
                  value={form.taxId}
                  onChange={(e) => setForm({ ...form, taxId: e.target.value })}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: 'var(--spacing-sm)', fontWeight: 500 }}>
                  Email
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: 'var(--spacing-sm)', fontWeight: 500 }}>
                  Teléfono
                </label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', marginBottom: 'var(--spacing-sm)', fontWeight: 500 }}>
                  Dirección
                </label>
                <input
                  type="text"
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: 'var(--spacing-sm)', fontWeight: 500 }}>
                  Ciudad
                </label>
                <input
                  type="text"
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: 'var(--spacing-sm)', fontWeight: 500 }}>
                  Código Postal
                </label>
                <input
                  type="text"
                  value={form.postalCode}
                  onChange={(e) => setForm({ ...form, postalCode: e.target.value })}
                />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 'var(--spacing-md)', marginTop: 'var(--spacing-lg)' }}>
              <button type="submit" className="btn btn-primary">
                {editingId ? 'Actualizar' : 'Crear'} Cliente
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                }}
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tabla de clientes */}
      <div className="card">
        {customers.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 'var(--spacing-xl)', color: 'var(--color-text-secondary)' }}>
            <p>No hay clientes. ¡Crea el primero!</p>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>CIF/NIF</th>
                <th>Email</th>
                <th>Ciudad</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr key={customer.id}>
                  <td><strong>{customer.name}</strong></td>
                  <td>{customer.taxId || '-'}</td>
                  <td>{customer.email || '-'}</td>
                  <td>{customer.city || '-'}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
                      <button
                        className="btn btn-small btn-secondary"
                        onClick={() => handleEdit(customer)}
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        className="btn btn-small btn-danger"
                        onClick={() => handleDelete(customer.id)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
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

export default CustomersPage;
