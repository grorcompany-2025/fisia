# CLAUDE.md - AI Assistant Guide for SpiritechFactu

> **Last Updated:** 2025-12-10
> **Version:** 1.0.0
> **Project:** SpiritechFactu - Professional Spanish Invoicing System
> **Status:** Production-Ready Beta

---

## 🎯 Purpose of This Document

This guide helps AI assistants understand the **SpiritechFactu** codebase, its structure, development workflows, and key conventions. Follow these guidelines when working with this repository.

---

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Repository Structure](#repository-structure)
3. [Technology Stack](#technology-stack)
4. [Development Workflows](#development-workflows)
5. [Code Conventions](#code-conventions)
6. [Key Architectural Patterns](#key-architectural-patterns)
7. [Database Schema](#database-schema)
8. [API Endpoints](#api-endpoints)
9. [Compliance & Security](#compliance--security)
10. [Deployment](#deployment)
11. [Common Tasks](#common-tasks)
12. [Troubleshooting](#troubleshooting)

---

## 🌟 Project Overview

**SpiritechFactu** is a full-stack invoicing system designed for Spanish businesses, ensuring full compliance with AEAT (Spanish Tax Agency) regulations and VeriFactu requirements.

### Key Features
- ✅ **AEAT/VeriFactu Compliance** - Full SIF (Sistemas Informáticos de Facturación) implementation
- ✅ **Hash Chain Integrity** - SHA256/512 cryptographic proof of invoice sequence
- ✅ **Invoice Management** - Complete CRUD with lifecycle (draft → issued → paid/cancelled)
- ✅ **PDF Generation** - Professional invoices with QR codes
- ✅ **XML Generation** - VeriFactu-compliant XML for AEAT submission
- ✅ **Modern UI** - React SPA with professional SaaS design

### Project Location
```
/home/user/fisia/spiritechfactu/
```

---

## 📁 Repository Structure

```
/home/user/fisia/
├── spiritechfactu/              # Main project directory
│   ├── backend/                 # Node.js/TypeScript API
│   │   ├── src/
│   │   │   ├── index.ts        # Express server (692 lines) - Main entry point
│   │   │   ├── services/       # Business logic layer
│   │   │   │   ├── HashService.ts       # Hash chain calculations
│   │   │   │   ├── InvoiceService.ts    # Invoice business logic
│   │   │   │   ├── PdfService.ts        # PDF generation
│   │   │   │   └── VerifactuService.ts  # AEAT XML generation
│   │   │   ├── models/
│   │   │   │   └── types.ts    # TypeScript interfaces (255 lines)
│   │   │   ├── utils/
│   │   │   │   ├── validation.ts  # Joi schemas
│   │   │   │   └── errors.ts      # Custom error classes
│   │   │   └── config/
│   │   │       └── env.ts      # Environment configuration
│   │   ├── dist/               # Compiled output (generated)
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── frontend/               # React SPA
│   │   ├── src/
│   │   │   ├── main.jsx       # React entry point
│   │   │   ├── App.jsx        # Router configuration
│   │   │   ├── api.js         # Axios HTTP client
│   │   │   ├── styles.css     # Global styles (530 lines)
│   │   │   ├── components/
│   │   │   │   ├── Layout.jsx   # Page wrapper
│   │   │   │   └── Sidebar.jsx  # Navigation
│   │   │   └── pages/
│   │   │       ├── DashboardPage.jsx      # Main dashboard
│   │   │       ├── InvoicesPage.jsx       # Invoice list
│   │   │       ├── NewInvoicePage.jsx     # Create invoice
│   │   │       ├── InvoiceDetailPage.jsx  # Invoice details
│   │   │       ├── CustomersPage.jsx      # Customer management
│   │   │       └── SettingsPage.jsx       # Company settings
│   │   ├── dist/              # Build output (generated)
│   │   ├── package.json
│   │   └── vite.config.js
│   │
│   ├── config/                # Production deployment configs
│   │   ├── nginx.conf         # Nginx reverse proxy (205 lines)
│   │   └── spiritechfactu.service  # Systemd service (118 lines)
│   │
│   ├── .env.example           # Environment variables template
│   ├── package.json           # Root workspace scripts
│   └── README.md              # Main documentation (2000+ lines)
│
├── PROYECTO_SPIRITECHFACTU.md  # Executive summary
├── ACCESO_ARCHIVOS.md          # File reference guide
└── RESUMEN_VISUAL.txt          # Visual project summary
```

### File Count Statistics
- **Total Files:** 32
- **TypeScript Files:** 9 (backend)
- **JavaScript/JSX Files:** 10 (frontend)
- **Configuration Files:** 6
- **Documentation Files:** 4
- **Total Lines of Code:** ~4,605 (excluding docs)

---

## 🛠 Technology Stack

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | 18+ LTS | Runtime environment |
| TypeScript | 5.3.2 | Type safety |
| Express | 4.18.2 | Web framework |
| Firebase Admin | 12.0.0 | Firestore database |
| Joi | 17.11.0 | Input validation |
| PDFKit | 0.13.0 | PDF generation |
| Crypto | Built-in | Hash calculations (SHA256/512) |

**Key Backend Files:**
- `backend/src/index.ts:1-692` - Main Express server with all endpoints
- `backend/src/services/HashService.ts` - Hash chain implementation
- `backend/src/services/VerifactuService.ts:1-300` - VeriFactu XML generation
- `backend/src/models/types.ts:10-128` - Core data models

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| React | 18.2.0 | UI library |
| React Router | 6.20.0 | Client-side routing |
| Vite | 5.0.0 | Build tool & dev server |
| Axios | 1.6.0 | HTTP client |
| Lucide React | 0.294.0 | Icon library |

**Key Frontend Files:**
- `frontend/src/App.jsx` - Routing configuration
- `frontend/src/api.js` - Centralized API client
- `frontend/src/styles.css:1-530` - Professional SaaS design system

### DevOps
- **Nginx** - Reverse proxy, SSL termination, static file serving
- **Systemd** - Process management
- **Let's Encrypt** - SSL/TLS certificates
- **Cloudflare** - DNS & CDN (optional)

---

## 🔄 Development Workflows

### Local Development Setup

```bash
# 1. Clone repository
git clone <repository-url>
cd spiritechfactu

# 2. Setup environment
cp .env.example .env
# Edit .env with actual credentials

# 3. Backend (Terminal 1)
cd backend
npm install
npm run dev        # Runs on port 3000 with hot-reload

# 4. Frontend (Terminal 2)
cd frontend
npm install
npm run dev        # Runs on port 5173 with HMR

# 5. Access application
# Open http://localhost:5173
# API proxied to http://localhost:3000
```

### NPM Scripts Reference

**Root Level:**
```json
{
  "dev": "concurrently \"cd backend && npm run dev\" \"cd frontend && npm run dev\"",
  "build": "npm run build:backend && npm run build:frontend",
  "start": "node backend/dist/index.js"
}
```

**Backend:**
```json
{
  "dev": "tsx watch src/index.ts",      // Hot-reload development
  "build": "tsc",                       // Compile TypeScript
  "start": "node dist/index.js"         // Production mode
}
```

**Frontend:**
```json
{
  "dev": "vite",                        // Dev server
  "build": "vite build",                // Production build
  "preview": "vite preview"             // Preview build locally
}
```

### Build Process

**Development Build:**
- Backend: TypeScript compiled on-the-fly with `tsx`
- Frontend: Vite dev server with Hot Module Replacement

**Production Build:**
```bash
npm run build
# → backend/dist/  (transpiled JavaScript)
# → frontend/dist/ (optimized bundle)
```

---

## 📝 Code Conventions

### Naming Conventions

```typescript
// Interfaces and Types - PascalCase
interface Company { ... }
interface Invoice { ... }

// Functions and Variables - camelCase
const calculateTotal = () => { ... }
const invoiceService = new InvoiceService();

// Classes - PascalCase
class HashService { ... }
class InvoiceService { ... }

// Constants - UPPER_SNAKE_CASE
const SOFTWARE_ID = 'SpiritechFactu_v1';
const DEFAULT_IVA_RATE = 21;

// Files - lowercase with hyphens or extensions
invoice-service.ts
DashboardPage.jsx
```

### TypeScript Conventions

**Strict Mode Enabled:**
```json
{
  "strict": true,
  "noImplicitAny": true,
  "strictNullChecks": true,
  "strictFunctionTypes": true,
  "noUnusedLocals": true,
  "noImplicitReturns": true
}
```

**Interface Definitions:**
- All data models defined in `backend/src/models/types.ts`
- Use interfaces for data structures, not classes
- Export all interfaces for reuse

**Example:**
```typescript
// backend/src/models/types.ts
export interface Invoice {
  id: string;
  companyId: string;
  invoiceNumber: string;
  customerId: string;
  issueDate: Date;
  dueDate: Date;
  lines: InvoiceLine[];
  subtotal: number;
  ivaAmount: number;
  totalAmount: number;
  status: 'draft' | 'issued' | 'paid' | 'cancelled';
  verifactuStatus: 'pending' | 'sent' | 'confirmed' | 'error';
  hashCurrent: string;
  hashPrevious: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### React Conventions

**Functional Components with Hooks:**
```javascript
// frontend/src/pages/DashboardPage.jsx
function DashboardPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const response = await api.invoices.list();
        setData(response.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (<div>...</div>);
}

export default DashboardPage;
```

**Styling:**
- CSS Variables for theming
- No inline styles except for dynamic values
- Global styles in `frontend/src/styles.css`

### Error Handling

**Custom Error Hierarchy:**
```typescript
// backend/src/utils/errors.ts
class AppError extends Error { ... }
class ValidationError extends AppError { ... }
class NotFoundError extends AppError { ... }
class VerifactuError extends AppError { ... }
```

**Usage:**
```typescript
// Throw specific errors
if (!invoice) {
  throw new NotFoundError('Invoice not found');
}

// Global error handler catches all
app.use((err, req, res, next) => {
  const details = getErrorDetails(err);
  res.status(details.statusCode).json({
    success: false,
    error: details,
    timestamp: new Date().toISOString()
  });
});
```

---

## 🏗 Key Architectural Patterns

### 1. Layered Architecture (Backend)

```
Controllers (index.ts)
    ↓
Services (Business Logic)
    ↓
Models (TypeScript Types)
    ↓
Data Store (Firestore)
```

**Service Layer Pattern:**
- Services are stateless with static methods
- Each service has single responsibility
- Services don't depend on Express (framework-agnostic)

**Example:**
```typescript
// backend/src/services/InvoiceService.ts
class InvoiceService {
  static createInvoice(data: CreateInvoiceDto): Invoice {
    // Pure business logic
  }

  static issueInvoice(invoice: Invoice, previousHash: string): Invoice {
    // Calculate hash, change status
  }
}
```

### 2. Hash Chain Pattern (VeriFactu Compliance)

**Critical Implementation:**
```typescript
// backend/src/services/HashService.ts
static calculateHash(
  invoiceId: string,
  issueDate: Date,
  subtotal: number,
  ivaAmount: number,
  totalAmount: number,
  previousHash: string,
  softwareId: string,
  algorithm: 'SHA256' | 'SHA512' = 'SHA256'
): string {
  const hashInput = [
    invoiceId,
    issueDate.toISOString(),
    subtotal.toFixed(2),
    ivaAmount.toFixed(2),
    totalAmount.toFixed(2),
    previousHash,
    softwareId
  ].join('|');

  const hash = crypto.createHash(algorithm.toLowerCase());
  hash.update(hashInput);
  return hash.digest('hex');
}
```

**Each invoice depends on the previous:**
```
Invoice 1: hash = SHA256(data1 + "initial" + softwareId)
Invoice 2: hash = SHA256(data2 + hash1 + softwareId)
Invoice 3: hash = SHA256(data3 + hash2 + softwareId)
```

### 3. Invoice Lifecycle State Machine

```
DRAFT → [issue()] → ISSUED → [pay()] → PAID
  ↓                    ↓
[delete()]        [cancel()] → CANCELLED
```

**Rules:**
- Only DRAFT can be edited
- ISSUED invoices are immutable
- Hash calculated when issuing
- Cancellation creates audit trail

**Implementation:**
```typescript
// backend/src/index.ts
app.post('/api/invoices/:id/issue', (req, res) => {
  const invoice = getInvoice(req.params.id);

  if (invoice.status !== 'draft') {
    throw new ValidationError('Can only issue draft invoices');
  }

  // Calculate hash chain
  const previousHash = getLastInvoiceHash(invoice.companyId);
  invoice.hashCurrent = HashService.calculateHash(...);
  invoice.hashPrevious = previousHash;
  invoice.status = 'issued';

  // Now immutable
  saveInvoice(invoice);
});
```

### 4. Repository Pattern (Data Access)

**Current (Development):**
```typescript
// In-memory Map storage
const dataStore = {
  companies: new Map<string, Company>(),
  customers: new Map<string, Customer>(),
  invoices: new Map<string, Invoice>(),
  lastInvoiceHashes: new Map<string, string>()
};
```

**Production (TODO):**
```typescript
// Firestore collections
const db = admin.firestore();
await db.collection('invoices').doc(id).set(invoice);
```

---

## 🗄 Database Schema

### Core Collections

**Companies** (`companies/{companyId}`)
```typescript
interface Company {
  id: string;
  name: string;
  taxId: string;              // CIF/NIF
  email: string;
  address: string;
  city: string;
  postalCode: string;
  province: string;
  country: string;

  // VeriFactu Configuration
  softwareId: string;
  softwareVersion: string;
  verifactuMode: 'testing' | 'production';
  hashAlgorithm: 'SHA256' | 'SHA512';

  // Tax Settings
  defaultIVARate: number;     // 0, 4, 10, 21

  createdAt: Date;
  updatedAt: Date;
}
```

**Customers** (`customers/{customerId}`)
```typescript
interface Customer {
  id: string;
  companyId: string;          // Foreign key
  name: string;
  taxId?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  province?: string;
  country?: string;

  createdAt: Date;
  updatedAt: Date;
}
```

**Invoices** (`invoices/{invoiceId}`)
```typescript
interface Invoice {
  id: string;
  companyId: string;
  invoiceNumber: string;
  customerId: string;

  issueDate: Date;
  dueDate: Date;

  lines: InvoiceLine[];

  subtotal: number;           // Base imponible
  ivaAmount: number;
  totalAmount: number;

  status: 'draft' | 'issued' | 'paid' | 'cancelled';
  verifactuStatus: 'pending' | 'sent' | 'confirmed' | 'error';

  // Hash Chain (Critical for AEAT)
  hashCurrent: string;
  hashPrevious: string;

  xmlContent?: string;
  qrDataUrl?: string;

  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}
```

**Invoice Lines**
```typescript
interface InvoiceLine {
  id: string;
  invoiceId: string;
  description: string;
  quantity: number;
  unitPrice: number;
  discount?: number;          // Percentage
  ivaRate: number;            // 0, 4, 10, 21

  subtotal: number;           // Auto-calculated
  ivaAmount: number;          // Auto-calculated
  total: number;              // Auto-calculated

  createdAt: Date;
}
```

---

## 🔌 API Endpoints

**Base URL:** `http://localhost:3000/api` (dev) or `https://domain.com/api` (prod)

### Companies
```
POST   /api/companies              Create company
GET    /api/companies/:id          Get company
PUT    /api/companies/:id          Update company
```

### Customers
```
POST   /api/customers              Create customer
GET    /api/customers              List customers (?companyId=xxx)
GET    /api/customers/:id          Get customer
PUT    /api/customers/:id          Update customer
DELETE /api/customers/:id          Delete customer
```

### Invoices
```
POST   /api/invoices               Create invoice (draft)
GET    /api/invoices               List invoices (?companyId=xxx)
GET    /api/invoices/:id           Get invoice
PUT    /api/invoices/:id           Update invoice (draft only)
POST   /api/invoices/:id/issue     Issue invoice (generates hash)
POST   /api/invoices/:id/cancel    Cancel invoice
POST   /api/invoices/:id/pdf       Generate PDF
```

### VeriFactu
```
POST   /api/verifactu/:invoiceId   Send to AEAT
GET    /api/verifactu/:invoiceId   Get VeriFactu status
```

### Response Format
```json
{
  "success": true,
  "data": { ... },
  "timestamp": "2025-12-10T10:30:00.000Z"
}
```

**Error Response:**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Description"
  },
  "timestamp": "2025-12-10T10:30:00.000Z"
}
```

---

## 🔐 Compliance & Security

### AEAT VeriFactu Requirements

**1. Integrity (Hash Chain)**
- ✅ Implemented in `backend/src/services/HashService.ts`
- ✅ SHA256/SHA512 support
- ✅ Chained to previous invoice

**2. Inalterability**
- ✅ Issued invoices cannot be edited
- ✅ Only cancellation allowed (with audit trail)

**3. Infalsificability**
- ⚠️ Prepared for digital signature (TODO in production)
- Location: `backend/src/services/VerifactuService.ts:120-180`

**4. Traceability**
- ✅ Fiscal events logged for every change
- Events: `invoice_created`, `invoice_issued`, `invoice_cancelled`, `verifactu_sent`

### Security Best Practices

**Environment Variables:**
- Never commit `.env` files
- Use `.env.example` as template
- Store sensitive data (Firebase credentials, API secrets) in `.env`

**Input Validation:**
- All inputs validated with Joi schemas
- Location: `backend/src/utils/validation.ts`

**Error Handling:**
- No sensitive data in error messages
- Consistent error format across API

---

## 🚀 Deployment

### VPS Deployment (IONOS)

**Architecture:**
```
Internet (HTTPS:443)
    ↓
Nginx (Reverse Proxy + SSL)
    ├─→ React SPA (static files from frontend/dist/)
    └─→ Node.js API (port 3000)
            ↓
        Firestore (Google Cloud)
```

**Key Files:**
- `config/nginx.conf` - Nginx configuration
- `config/spiritechfactu.service` - Systemd service

**Deployment Steps:**
1. Build both frontend and backend
2. Copy files to `/var/www/spiritechfactu`
3. Configure Nginx with SSL
4. Setup systemd service
5. Start and enable service

**See:** `spiritechfactu/README.md` lines 492-680 for detailed deployment guide

---

## 🔧 Common Tasks

### Adding a New Endpoint

1. **Define types** in `backend/src/models/types.ts`
2. **Create validation schema** in `backend/src/utils/validation.ts`
3. **Add endpoint** in `backend/src/index.ts`
4. **Add to API client** in `frontend/src/api.js`

Example:
```typescript
// 1. backend/src/models/types.ts
export interface Product {
  id: string;
  name: string;
  price: number;
}

// 2. backend/src/utils/validation.ts
const productSchema = Joi.object({
  name: Joi.string().required(),
  price: Joi.number().positive().required()
});

// 3. backend/src/index.ts
app.post('/api/products', (req, res) => {
  const { error, value } = productSchema.validate(req.body);
  if (error) throw new ValidationError(error.message);

  const product = { id: uuidv4(), ...value };
  dataStore.products.set(product.id, product);

  res.json({ success: true, data: product });
});

// 4. frontend/src/api.js
export const productsAPI = {
  create: (data) => api.post('/products', data),
  list: () => api.get('/products')
};
```

### Adding a New Page

1. **Create page component** in `frontend/src/pages/`
2. **Add route** in `frontend/src/App.jsx`
3. **Add navigation link** in `frontend/src/components/Sidebar.jsx`

### Modifying Hash Calculation

**⚠️ CRITICAL:** Changing hash calculation breaks chain integrity!

If you must modify:
1. Edit `backend/src/services/HashService.ts`
2. Update hash fields in order
3. Test thoroughly
4. Consider migration strategy for existing invoices

---

## 🐛 Troubleshooting

### Backend Won't Start

**Check:**
```bash
# View logs
journalctl -u spiritechfactu -n 50

# Common issues:
# - Port 3000 in use
# - Missing .env file
# - Invalid Firebase credentials
```

### Frontend Build Fails

**Check:**
```bash
cd frontend
npm run build

# Common issues:
# - Missing node_modules (run npm install)
# - Syntax errors in JSX
# - Missing dependencies
```

### Hash Verification Fails

**Check:**
```typescript
// backend/src/services/HashService.ts
// Ensure fields are in correct order
// Ensure decimal precision (toFixed(2))
// Ensure previousHash is correct
```

### PDF Generation Issues

**Check:**
```typescript
// backend/src/services/PdfService.ts
// Ensure PDFKit is installed
// Check file paths for fonts/images
```

---

## 📚 Additional Resources

**Main Documentation:**
- `spiritechfactu/README.md` - Comprehensive guide (2000+ lines)
- `PROYECTO_SPIRITECHFACTU.md` - Executive summary
- `ACCESO_ARCHIVOS.md` - File reference map

**Key Code References:**
- Hash Service: `backend/src/services/HashService.ts:1-130`
- VeriFactu XML: `backend/src/services/VerifactuService.ts:1-300`
- Main Server: `backend/src/index.ts:1-692`
- Type Definitions: `backend/src/models/types.ts:10-255`

**External Documentation:**
- [BOE RD 1619/2012 - SIF](https://www.boe.es/buscar/doc.php?id=BOE-A-2012-15167)
- [AEAT VeriFactu Technical Docs](https://www.agenciatributaria.gob.es/)

---

## ✅ Development Checklist

When working with this codebase:

- [ ] Always read files before modifying
- [ ] Follow TypeScript strict mode
- [ ] Validate inputs with Joi schemas
- [ ] Use custom error classes
- [ ] Never modify issued invoices
- [ ] Test hash chain integrity
- [ ] Update tests when adding features
- [ ] Document complex logic
- [ ] Follow naming conventions
- [ ] Keep services stateless

---

## 🎯 Production TODOs

**Critical for Production:**
- [ ] Replace in-memory storage with Firestore
- [ ] Implement real AEAT connection
- [ ] Add digital certificate signing (XMLDSIG)
- [ ] Implement authentication (JWT/OAuth2)
- [ ] Add comprehensive tests
- [ ] Setup logging (Winston/Pino)
- [ ] Configure monitoring

**See:** `PROYECTO_SPIRITECHFACTU.md` lines 484-529 for complete TODO list

---

## 📧 Support

For questions about this codebase:
- Check `spiritechfactu/README.md` first
- Review code comments in critical files
- Consult TypeScript interfaces for data structures
- Test changes in development environment first

---

**Remember:** This is a compliance-critical system. Changes to hash calculation, invoice lifecycle, or VeriFactu XML generation must be carefully reviewed and tested.
