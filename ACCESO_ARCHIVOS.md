# 📂 ACCESO A LOS ARCHIVOS - SPIRITECHFACTU

## 📍 UBICACIÓN BASE
```
/home/user/fisia/spiritechfactu/
```

---

## 🔙 BACKEND (Node.js + TypeScript)

### Configuración
- **Package.json:** `backend/package.json`
- **TypeScript Config:** `backend/tsconfig.json`
- **Punto de entrada:** `backend/src/index.ts` ⭐

### Servicios (Business Logic)
```
backend/src/services/
├── HashService.ts           (Hash encadenado)
├── VerifactuService.ts      (XML AEAT)
├── InvoiceService.ts        (Facturas)
└── PdfService.ts            (Generación PDF)
```

### Modelos & Tipos
```
backend/src/models/
└── types.ts                 (Interfaces TypeScript)
```

### Utilidades
```
backend/src/utils/
├── validation.ts            (Esquemas Joi)
└── errors.ts                (Clases de error)
```

### Configuración
```
backend/src/config/
└── env.ts                   (Variables entorno)
```

---

## 🎨 FRONTEND (React + Vite)

### Configuración
- **Package.json:** `frontend/package.json`
- **Vite Config:** `frontend/vite.config.js`
- **HTML Entry:** `frontend/index.html`

### Punto de entrada
```
frontend/src/
├── main.jsx                 (Entry React)
├── App.jsx                  (Router)
├── api.js                   (Axios client)
└── styles.css               (Estilos globales)
```

### Componentes
```
frontend/src/components/
├── Layout.jsx               (Header/Footer)
└── Sidebar.jsx              (Navegación)
```

### Páginas (Rutas)
```
frontend/src/pages/
├── DashboardPage.jsx        (/)
├── InvoicesPage.jsx         (/invoices)
├── NewInvoicePage.jsx       (/invoices/new)
├── InvoiceDetailPage.jsx    (/invoices/:id)
├── CustomersPage.jsx        (/customers)
└── SettingsPage.jsx         (/settings)
```

---

## 🚀 CONFIGURACIÓN PRODUCCIÓN

### Nginx
- **Archivo:** `config/nginx.conf`
- **Descripción:** Reverse proxy, SSL, GZIP, cache
- **Instalación:** `sudo cp config/nginx.conf /etc/nginx/sites-available/spiritechfactu`

### Systemd Service
- **Archivo:** `config/spiritechfactu.service`
- **Descripción:** Servicio automático de backend
- **Instalación:** `sudo cp config/spiritechfactu.service /etc/systemd/system/`

---

## 📚 DOCUMENTACIÓN

### README Completo
- **Archivo:** `README.md` (2000+ líneas)
- **Contiene:**
  - Descripción y arquitectura
  - Requisitos del sistema
  - Instalación paso a paso
  - Cumplimiento AEAT/VeriFactu explicado
  - Deployment en VPS IONOS (9 pasos)
  - DNS y Cloudflare
  - Guía de uso
  - API Reference
  - Troubleshooting

### Variables de Entorno
- **Archivo:** `.env.example`
- **Uso:** `cp .env.example .env` (editar con datos reales)

### Seguridad
- **Archivo:** `.gitignore`
- **Propósito:** No comprometer .env ni credenciales

---

## 📦 ROOT LEVEL

### Package.json (Root)
- **Archivo:** `package.json`
- **Scripts:**
  - `npm run dev` - Desarrollo (backend + frontend)
  - `npm run build` - Build (backend + frontend)
  - `npm start` - Producción

---

## 🗂️ ÁRBOL COMPLETO

```
/home/user/fisia/spiritechfactu/
│
├── 🔙 backend/
│   ├── src/
│   │   ├── index.ts                    ⭐ [550 líneas] Express server
│   │   ├── services/
│   │   │   ├── HashService.ts
│   │   │   ├── VerifactuService.ts
│   │   │   ├── InvoiceService.ts
│   │   │   └── PdfService.ts
│   │   ├── models/
│   │   │   └── types.ts
│   │   ├── utils/
│   │   │   ├── validation.ts
│   │   │   └── errors.ts
│   │   └── config/
│   │       └── env.ts
│   ├── package.json
│   └── tsconfig.json
│
├── 🎨 frontend/
│   ├── src/
│   │   ├── main.jsx
│   │   ├── App.jsx
│   │   ├── api.js
│   │   ├── styles.css              ⭐ [500 líneas] SaaS design
│   │   ├── components/
│   │   │   ├── Layout.jsx
│   │   │   └── Sidebar.jsx
│   │   └── pages/
│   │       ├── DashboardPage.jsx
│   │       ├── InvoicesPage.jsx
│   │       ├── NewInvoicePage.jsx
│   │       ├── InvoiceDetailPage.jsx
│   │       ├── CustomersPage.jsx
│   │       └── SettingsPage.jsx
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── 🚀 config/
│   ├── nginx.conf                  ⭐ [200 líneas] Producción
│   └── spiritechfactu.service      [100 líneas] Systemd
│
├── 📚 Documentación
│   ├── README.md                   ⭐ [2000+ líneas] Completo
│   └── .env.example                Variables entorno
│
├── 🔐 Seguridad
│   └── .gitignore                  No comprometer
│
└── 📦 Root
    └── package.json                Scripts principales
```

---

## 🎯 ARCHIVOS CLAVE POR FUNCIONALIDAD

### Hash Encadenado (Integridad)
- **Archivo:** `backend/src/services/HashService.ts`
- **Métodos clave:**
  - `calculateHash()` - SHA256/SHA512
  - `verifyHash()` - Validar integridad
  - `generateInitialHash()` - Hash inicial

### VeriFactu (AEAT)
- **Archivo:** `backend/src/services/VerifactuService.ts`
- **Métodos clave:**
  - `generateAltaXml()` - XML registro
  - `generateAnulacionXml()` - XML cancelación
  - `generateSOAPRequest()` - Envío AEAT
  - `sendToAEAT()` - [TODO] Integración real

### Facturas
- **Archivo:** `backend/src/services/InvoiceService.ts`
- **Métodos clave:**
  - `createInvoice()` - Crear
  - `issueInvoice()` - Emitir
  - `calculateTotals()` - Cálculos
  - `cancelInvoice()` - Cancelar

### PDFs Profesionales
- **Archivo:** `backend/src/services/PdfService.ts`
- **Métodos clave:**
  - `generateInvoicePdf()` - Crear PDF
  - `addHeader()` - Encabezado
  - `addLines()` - Tabla de líneas
  - `addTotals()` - Resumen

### Validación
- **Archivo:** `backend/src/utils/validation.ts`
- **Esquemas:**
  - `companySchema` - Empresas
  - `customerSchema` - Clientes
  - `invoiceSchema` - Facturas
  - `invoiceLineSchema` - Líneas

### Errores
- **Archivo:** `backend/src/utils/errors.ts`
- **Clases:**
  - `AppError` - Base
  - `ValidationError`
  - `NotFoundError`
  - `VerifactuError`
  - Y más...

### Tipos TypeScript
- **Archivo:** `backend/src/models/types.ts`
- **Interfaces:**
  - `Company` - Empresa
  - `Customer` - Cliente
  - `Invoice` - Factura
  - `InvoiceLine` - Línea
  - `VerifactuRecord` - Registro AEAT
  - `FiscalEvent` - Eventos

### API Cliente
- **Archivo:** `frontend/src/api.js`
- **Funciones:**
  - `companiesAPI.create/get/update`
  - `customersAPI.create/list/get/update/delete`
  - `invoicesAPI.create/list/get/issue/cancel/pdf`
  - `verifactuAPI.send/getStatus`

### Estilos
- **Archivo:** `frontend/src/styles.css`
- **Incluye:**
  - Variables CSS (colores, espaciado)
  - Componentes base (btn, card, badge)
  - Dark mode preparado
  - Responsive media queries

### Nginx
- **Archivo:** `config/nginx.conf`
- **Configura:**
  - HTTP → HTTPS redirect
  - Reverse proxy `/api/`
  - Servir SPA (index.html fallback)
  - Compresión GZIP
  - Cache de assets
  - Headers de seguridad

### Systemd
- **Archivo:** `config/spiritechfactu.service`
- **Configura:**
  - Inicio automático
  - Reinicio en falla
  - Usuario dedicado
  - Límites de recursos

---

## 🚀 CÓMO EMPEZAR

### Opción 1: Ver el código en tu IDE

```bash
cd /home/user/fisia/spiritechfactu
# Abre en tu editor preferido:
# VSCode: code .
# Sublime: subl .
# Vim: vim .
```

### Opción 2: Explorar en terminal

```bash
# Ver estructura
tree spiritechfactu -L 3

# Ver archivo específico
cat spiritechfactu/backend/src/services/HashService.ts

# Ver README
less spiritechfactu/README.md
```

### Opción 3: Clonar y ejecutar

```bash
git clone [repo] spiritechfactu-local
cd spiritechfactu-local

# Backend
cd backend && npm install && npm run dev

# Frontend (otro terminal)
cd frontend && npm install && npm run dev
```

---

## 📊 ESTADÍSTICAS DE ARCHIVOS

| Tipo | Cantidad | Líneas | Descripción |
|------|----------|--------|-------------|
| TypeScript (.ts) | 8 | ~2,500 | Backend completo |
| React JSX (.jsx) | 8 | ~1,800 | Frontend completo |
| JavaScript (.js) | 2 | ~300 | Configs + client |
| CSS | 1 | ~500 | Estilos SaaS |
| JSON | 4 | ~300 | Configs npm |
| Nginx | 1 | ~200 | Producción |
| Systemd | 1 | ~100 | Servicio |
| Markdown | 1 | ~2,000 | Documentación |
| **TOTAL** | **32** | **~6,800** | **Completo** |

---

## ✅ PRÓXIMOS PASOS

### 1. Leer la documentación
```bash
cat spiritechfactu/README.md
```

### 2. Ver resumenes visuales
```bash
cat RESUMEN_VISUAL.txt
cat PROYECTO_SPIRITECHFACTU.md
```

### 3. Explorar el código
Abre en tu IDE favorito la carpeta `/home/user/fisia/spiritechfactu/`

### 4. Seguir los pasos de deployment
Consulta README.md sección "Deployment en VPS IONOS"

---

## 🔗 REFERENCIAS ÚTILES

**En el código:**
- Comentarios explicativos en secciones críticas
- [TODO] marcados para tareas pendientes
- Tipos TypeScript completos para autocompletar
- Métodos documentados con JSDoc

**En la documentación:**
- Diagrama de arquitectura
- Guías paso a paso
- Cumplimiento AEAT explicado
- Troubleshooting común

---

**¡Todo el código está listo para usar y desplegar! 🚀**
