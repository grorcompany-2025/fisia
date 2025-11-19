/**
 * DashboardPage.jsx - Dashboard principal con resumen de información
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { invoicesAPI, getCurrentCompany } from '../api';
import { BarChart3, FileText, Users, TrendingUp } from 'lucide-react';

/**
 * DashboardPage - Vista principal con KPIs y resumen
 */
function DashboardPage() {
  const [stats, setStats] = useState({
    totalInvoices: 0,
    totalAmount: 0,
    paidAmount: 0,
    pendingAmount: 0,
  });
  const [recentInvoices, setRecentInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  // Cargar datos
  useEffect(() => {
    loadDashboardData();
  }, []);

  async function loadDashboardData() {
    try {
      const companyId = getCurrentCompany();
      if (!companyId) return;

      const response = await invoicesAPI.list(companyId);
      const invoices = response.data?.data || [];

      // Calcular estadísticas
      const totalInvoices = invoices.length;
      const totalAmount = invoices.reduce((sum, inv) => sum + inv.totalAmount, 0);
      const paidAmount = invoices
        .filter((inv) => inv.status === 'paid')
        .reduce((sum, inv) => sum + inv.totalAmount, 0);
      const pendingAmount = totalAmount - paidAmount;

      setStats({
        totalInvoices,
        totalAmount,
        paidAmount,
        pendingAmount,
      });

      // Últimas 5 facturas
      setRecentInvoices(invoices.slice(0, 5));
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  }

  const StatCard = ({ icon: Icon, label, value, color = 'var(--color-primary)' }) => (
    <div className="card" style={{ flex: 1, minWidth: '200px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--spacing-md)' }}>
        <div
          style={{
            width: '48px',
            height: '48px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: `${color}20`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color,
          }}
        >
          <Icon size={24} />
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ margin: 0, color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)' }}>
            {label}
          </p>
          <p style={{ margin: 'var(--spacing-xs) 0 0 0', fontSize: 'var(--font-size-2xl)', fontWeight: 600 }}>
            {value}
          </p>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: 'var(--spacing-xl)' }}>
        <div className="spinner"></div>
        <p>Cargando datos...</p>
      </div>
    );
  }

  return (
    <div>
      {/* Encabezado */}
      <div style={{ marginBottom: 'var(--spacing-xl)' }}>
        <h1>Dashboard</h1>
        <p style={{ color: 'var(--color-text-secondary)' }}>
          Resumen de tu actividad de facturación
        </p>
      </div>

      {/* Stats */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: 'var(--spacing-lg)',
          marginBottom: 'var(--spacing-xl)',
        }}
      >
        <StatCard
          icon={FileText}
          label="Total Facturas"
          value={stats.totalInvoices}
          color="var(--color-primary)"
        />
        <StatCard
          icon={TrendingUp}
          label="Total Facturado"
          value={`€ ${stats.totalAmount.toFixed(2)}`}
          color="var(--color-success)"
        />
        <StatCard
          icon={BarChart3}
          label="Pagado"
          value={`€ ${stats.paidAmount.toFixed(2)}`}
          color="var(--color-info)"
        />
        <StatCard
          icon={Users}
          label="Pendiente"
          value={`€ ${stats.pendingAmount.toFixed(2)}`}
          color="var(--color-warning)"
        />
      </div>

      {/* Acciones rápidas */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 'var(--spacing-lg)',
          marginBottom: 'var(--spacing-xl)',
        }}
      >
        <Link
          to="/invoices/new"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 'var(--spacing-lg)',
            backgroundColor: 'var(--color-primary)',
            color: 'white',
            borderRadius: 'var(--radius-lg)',
            textDecoration: 'none',
            fontWeight: 500,
            transition: 'all var(--transition-fast)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--color-primary-dark)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--color-primary)';
          }}
        >
          + Nueva Factura
        </Link>
        <Link
          to="/invoices"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 'var(--spacing-lg)',
            backgroundColor: 'var(--color-bg-secondary)',
            color: 'var(--color-text)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--color-border)',
            textDecoration: 'none',
            fontWeight: 500,
            transition: 'all var(--transition-fast)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--color-bg-tertiary)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--color-bg-secondary)';
          }}
        >
          Ver Todas las Facturas
        </Link>
      </div>

      {/* Facturas recientes */}
      <div className="card">
        <div className="card-header">
          <h2>Facturas Recientes</h2>
          <Link
            to="/invoices"
            style={{
              color: 'var(--color-primary)',
              textDecoration: 'none',
              fontSize: 'var(--font-size-sm)',
              fontWeight: 500,
            }}
          >
            Ver todas →
          </Link>
        </div>

        {recentInvoices.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 'var(--spacing-xl)', color: 'var(--color-text-secondary)' }}>
            <p>No hay facturas aún. ¡Crea la primera!</p>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Número</th>
                <th>Cliente</th>
                <th>Total</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {recentInvoices.map((inv) => (
                <tr
                  key={inv.id}
                  style={{ cursor: 'pointer' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--color-bg-secondary)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <td>
                    <Link
                      to={`/invoices/${inv.id}`}
                      style={{ color: 'var(--color-primary)', textDecoration: 'none', fontWeight: 500 }}
                    >
                      {inv.invoiceNumber}
                    </Link>
                  </td>
                  <td>{inv.customerId}</td>
                  <td>€ {inv.totalAmount.toFixed(2)}</td>
                  <td>
                    <span
                      className={`badge badge-${
                        inv.status === 'issued' ? 'primary' : inv.status === 'paid' ? 'success' : 'warning'
                      }`}
                    >
                      {inv.status}
                    </span>
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

export default DashboardPage;
