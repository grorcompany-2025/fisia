/**
 * SettingsPage.jsx - Página de configuración de empresa
 */

import React, { useState, useEffect } from 'react';
import { companiesAPI, getCurrentCompany, setCurrentCompany } from '../api';
import { Save } from 'lucide-react';

function SettingsPage() {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    taxId: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    province: '',
    website: '',
    softwareId: 'SpiritechFactu_v1',
    softwareVersion: '1.0.0',
    verifactuMode: 'testing',
    hashAlgorithm: 'SHA256',
    defaultIVARate: 21,
  });
  const [isNew, setIsNew] = useState(false);

  useEffect(() => {
    loadCompany();
  }, []);

  async function loadCompany() {
    try {
      const companyId = getCurrentCompany();
      if (companyId) {
        const response = await companiesAPI.get(companyId);
        setForm(response.data.data);
        setIsNew(false);
      } else {
        setIsNew(true);
      }
    } catch (error) {
      console.error('Error loading company:', error);
      setIsNew(true);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    try {
      const currentCompanyId = getCurrentCompany();

      if (currentCompanyId) {
        // Actualizar
        await companiesAPI.update(currentCompanyId, form);
        alert('Configuración actualizada correctamente');
      } else {
        // Crear
        const response = await companiesAPI.create(form);
        setCurrentCompany(response.data.data.id);
        setForm(response.data.data);
        setIsNew(false);
        alert('Empresa creada correctamente');
      }
    } catch (error) {
      console.error('Error saving company:', error);
      alert('Error al guardar la configuración');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      {/* Encabezado */}
      <div style={{ marginBottom: 'var(--spacing-xl)' }}>
        <h1>Configuración</h1>
        <p style={{ color: 'var(--color-text-secondary)' }}>
          Gestiona los datos de tu empresa y parámetros fiscales
        </p>
      </div>

      {/* Alerta de información */}
      <div className="alert alert-info" style={{ marginBottom: 'var(--spacing-lg)' }}>
        <p style={{ margin: 0 }}>
          ℹ️ Esta es una versión de prueba. Para producción con AEAT real, configura certificado digital
          y credenciales de conexión VeriFactu.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Datos de empresa */}
        <div className="card" style={{ marginBottom: 'var(--spacing-lg)' }}>
          <h3>Datos de la Empresa</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--spacing-md)' }}>
            <div>
              <label style={{ display: 'block', marginBottom: 'var(--spacing-sm)', fontWeight: 500 }}>
                Nombre de Empresa *
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
                CIF/NIF *
              </label>
              <input
                type="text"
                required
                value={form.taxId}
                onChange={(e) => setForm({ ...form, taxId: e.target.value.toUpperCase() })}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: 'var(--spacing-sm)', fontWeight: 500 }}>
                Email *
              </label>
              <input
                type="email"
                required
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
                Dirección *
              </label>
              <input
                type="text"
                required
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: 'var(--spacing-sm)', fontWeight: 500 }}>
                Ciudad *
              </label>
              <input
                type="text"
                required
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: 'var(--spacing-sm)', fontWeight: 500 }}>
                Código Postal *
              </label>
              <input
                type="text"
                required
                value={form.postalCode}
                onChange={(e) => setForm({ ...form, postalCode: e.target.value })}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: 'var(--spacing-sm)', fontWeight: 500 }}>
                Provincia *
              </label>
              <input
                type="text"
                required
                value={form.province}
                onChange={(e) => setForm({ ...form, province: e.target.value })}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: 'var(--spacing-sm)', fontWeight: 500 }}>
                Web
              </label>
              <input
                type="url"
                value={form.website}
                onChange={(e) => setForm({ ...form, website: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* Configuración Fiscal */}
        <div className="card" style={{ marginBottom: 'var(--spacing-lg)' }}>
          <h3>Configuración Fiscal</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--spacing-md)' }}>
            <div>
              <label style={{ display: 'block', marginBottom: 'var(--spacing-sm)', fontWeight: 500 }}>
                IVA por Defecto (%)
              </label>
              <select
                value={form.defaultIVARate}
                onChange={(e) => setForm({ ...form, defaultIVARate: parseInt(e.target.value) })}
              >
                <option value="0">0% (Exento)</option>
                <option value="4">4%</option>
                <option value="10">10%</option>
                <option value="21">21% (General)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Configuración VeriFactu */}
        <div className="card" style={{ marginBottom: 'var(--spacing-lg)' }}>
          <h3>Configuración VeriFactu</h3>
          <div className="alert alert-warning" style={{ marginBottom: 'var(--spacing-md)' }}>
            <p style={{ margin: 0 }}>
              ⚠️ VeriFactu está en modo TESTING. Para producción, cambiar a modo producción y
              configurar certificado digital.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--spacing-md)' }}>
            <div>
              <label style={{ display: 'block', marginBottom: 'var(--spacing-sm)', fontWeight: 500 }}>
                Modo
              </label>
              <select
                value={form.verifactuMode}
                onChange={(e) => setForm({ ...form, verifactuMode: e.target.value })}
              >
                <option value="testing">Testing (Pruebas)</option>
                <option value="production">Production (Real)</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: 'var(--spacing-sm)', fontWeight: 500 }}>
                Algoritmo Hash
              </label>
              <select
                value={form.hashAlgorithm}
                onChange={(e) => setForm({ ...form, hashAlgorithm: e.target.value })}
              >
                <option value="SHA256">SHA256</option>
                <option value="SHA512">SHA512</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: 'var(--spacing-sm)', fontWeight: 500 }}>
                Software ID
              </label>
              <input
                type="text"
                disabled
                value={form.softwareId}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: 'var(--spacing-sm)', fontWeight: 500 }}>
                Versión Software
              </label>
              <input
                type="text"
                disabled
                value={form.softwareVersion}
              />
            </div>
          </div>
        </div>

        {/* Información de Cumplimiento */}
        <div className="card" style={{ marginBottom: 'var(--spacing-lg)' }}>
          <h3>Cumplimiento Normativo</h3>
          <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
            <p style={{ marginBottom: 'var(--spacing-md)' }}>
              ✅ <strong>SIF (Sistemas Informáticos de Facturación):</strong> El sistema cumple
              requisitos de integridad, inalterabilidad e infalsificabilidad mediante hash
              encadenado.
            </p>
            <p style={{ marginBottom: 'var(--spacing-md)' }}>
              ✅ <strong>VeriFactu:</strong> Generación y envío de registros XML según estructura AEAT.
            </p>
            <p>
              ℹ️ <strong>Homologación AEAT:</strong> TODO - Contactar con la AEAT para homologación
              oficial en modo producción.
            </p>
          </div>
        </div>

        {/* Botones */}
        <div style={{ display: 'flex', gap: 'var(--spacing-md)', justifyContent: 'flex-end' }}>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            <Save size={20} />
            {loading ? 'Guardando...' : isNew ? 'Crear Empresa' : 'Guardar Cambios'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default SettingsPage;
