/**
 * Layout.jsx - Componente contenedor con encabezado y footer
 */

import React from 'react';

/**
 * Layout - Proporciona estructura básica a las páginas
 */
function Layout({ children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Header */}
      <header
        style={{
          backgroundColor: 'var(--color-bg-secondary)',
          borderBottom: '1px solid var(--color-border)',
          padding: 'var(--spacing-md) var(--spacing-lg)',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h1 style={{ margin: 0, fontSize: 'var(--font-size-xl)' }}>🧾 SpiritechFactu</h1>
            <nav style={{ display: 'flex', gap: 'var(--spacing-lg)' }}>
              <a href="/" style={{ color: 'var(--color-text)' }}>
                Inicio
              </a>
              <a href="/invoices" style={{ color: 'var(--color-text)' }}>
                Facturas
              </a>
              <a href="/customers" style={{ color: 'var(--color-text)' }}>
                Clientes
              </a>
              <a href="/settings" style={{ color: 'var(--color-text)' }}>
                Configuración
              </a>
            </nav>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main style={{ flex: 1, padding: 'var(--spacing-xl)' }}>
        <div className="container">{children}</div>
      </main>

      {/* Footer */}
      <footer
        style={{
          backgroundColor: 'var(--color-bg-secondary)',
          borderTop: '1px solid var(--color-border)',
          padding: 'var(--spacing-lg)',
          textAlign: 'center',
          color: 'var(--color-text-secondary)',
          fontSize: 'var(--font-size-sm)',
        }}
      >
        <p style={{ margin: 0 }}>
          © 2024 SpiritechFactu v1.0.0 | Cumplimiento AEAT/VeriFactu | Desarrollado con ❤️
        </p>
      </footer>
    </div>
  );
}

export default Layout;
