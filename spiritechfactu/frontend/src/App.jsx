/**
 * App.jsx - Componente raíz de la aplicación
 * Maneja rutas, layout y contexto global
 */

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Componentes
import Layout from './components/Layout';
import Sidebar from './components/Sidebar';

// Páginas
import DashboardPage from './pages/DashboardPage';
import InvoicesPage from './pages/InvoicesPage';
import NewInvoicePage from './pages/NewInvoicePage';
import InvoiceDetailPage from './pages/InvoiceDetailPage';
import CustomersPage from './pages/CustomersPage';
import SettingsPage from './pages/SettingsPage';

// Utilidades
import { getCurrentCompany } from './api';

/**
 * App - Componente principal
 */
function App() {
  const [currentCompany, setCurrentCompany] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Al montar, obtener compañía actual del localStorage
  useEffect(() => {
    const companyId = getCurrentCompany();
    if (companyId) {
      // TODO: Cargar datos de la compañía desde API
      setCurrentCompany(companyId);
    }
  }, []);

  // Si no hay compañía, redirigir a configuración
  if (!currentCompany) {
    return (
      <Router>
        <Routes>
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<Navigate to="/settings" />} />
        </Routes>
      </Router>
    );
  }

  return (
    <Router>
      <div style={{ display: 'flex', height: '100vh' }}>
        {/* Barra lateral */}
        <Sidebar
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
          currentCompany={currentCompany}
        />

        {/* Contenido principal */}
        <main style={{ flex: 1, overflow: 'auto' }}>
          <Layout>
            <Routes>
              {/* Dashboard */}
              <Route path="/" element={<DashboardPage />} />

              {/* Facturas */}
              <Route path="/invoices" element={<InvoicesPage />} />
              <Route path="/invoices/new" element={<NewInvoicePage />} />
              <Route path="/invoices/:id" element={<InvoiceDetailPage />} />

              {/* Clientes */}
              <Route path="/customers" element={<CustomersPage />} />

              {/* Configuración */}
              <Route path="/settings" element={<SettingsPage />} />

              {/* Rutas no encontradas */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </Layout>
        </main>
      </div>
    </Router>
  );
}

export default App;
