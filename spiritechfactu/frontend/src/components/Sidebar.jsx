/**
 * Sidebar.jsx - Barra lateral de navegación
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Home, FileText, Users, Settings } from 'lucide-react';

/**
 * Sidebar - Navegación lateral con menú
 */
function Sidebar({ isOpen, onToggle, currentCompany }) {
  const menuItems = [
    { path: '/', label: 'Dashboard', icon: Home },
    { path: '/invoices', label: 'Facturas', icon: FileText },
    { path: '/customers', label: 'Clientes', icon: Users },
    { path: '/settings', label: 'Configuración', icon: Settings },
  ];

  return (
    <>
      {/* Botón toggle (mobile) */}
      <button
        onClick={onToggle}
        style={{
          position: 'fixed',
          top: '1rem',
          left: '1rem',
          zIndex: 50,
          display: isOpen ? 'none' : 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '2rem',
          height: '2rem',
          borderRadius: 'var(--radius-md)',
          backgroundColor: 'var(--color-primary)',
          color: 'white',
          cursor: 'pointer',
        }}
      >
        <Menu size={20} />
      </button>

      {/* Overlay (mobile) */}
      {isOpen && (
        <div
          onClick={onToggle}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 10,
            display: 'none',
          }}
        />
      )}

      {/* Sidebar */}
      <aside
        style={{
          width: isOpen ? '250px' : '0',
          backgroundColor: 'var(--color-bg-secondary)',
          borderRight: '1px solid var(--color-border)',
          padding: isOpen ? 'var(--spacing-lg)' : '0',
          overflowY: 'auto',
          transition: 'width var(--transition-base)',
          boxShadow: 'var(--shadow-md)',
        }}
      >
        {isOpen && (
          <div>
            {/* Header */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 'var(--spacing-xl)',
              }}
            >
              <h2 style={{ margin: 0, fontSize: 'var(--font-size-lg)' }}>Menu</h2>
              <button
                onClick={onToggle}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--color-text)',
                }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Información de empresa */}
            <div
              style={{
                backgroundColor: 'var(--color-bg)',
                padding: 'var(--spacing-md)',
                borderRadius: 'var(--radius-md)',
                marginBottom: 'var(--spacing-lg)',
                fontSize: 'var(--font-size-sm)',
                color: 'var(--color-text-secondary)',
              }}
            >
              <p style={{ margin: 0, fontWeight: 600, color: 'var(--color-text)' }}>
                Empresa Activa
              </p>
              <p style={{ margin: 'var(--spacing-xs) 0 0 0' }}>ID: {currentCompany?.substring(0, 8)}</p>
            </div>

            {/* Navegación */}
            <nav>
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'var(--spacing-md)',
                      padding: 'var(--spacing-md) var(--spacing-md)',
                      marginBottom: 'var(--spacing-sm)',
                      color: 'var(--color-text)',
                      textDecoration: 'none',
                      borderRadius: 'var(--radius-md)',
                      transition: 'background-color var(--transition-fast)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--color-bg)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <Icon size={20} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Footer de sidebar */}
            <div
              style={{
                marginTop: 'var(--spacing-xl)',
                paddingTop: 'var(--spacing-md)',
                borderTop: '1px solid var(--color-border)',
                fontSize: 'var(--font-size-xs)',
                color: 'var(--color-text-tertiary)',
              }}
            >
              <p style={{ margin: 0 }}>SpiritechFactu v1.0.0</p>
              <p style={{ margin: 'var(--spacing-xs) 0 0 0' }}>Cumplimiento AEAT/VeriFactu</p>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}

export default Sidebar;
