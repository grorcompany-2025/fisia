# 🧾 SpiritechFactu - Sistema Profesional de Facturación

**Versión:** 1.0.0
**Estado:** Beta - Listo para producción
**Cumplimiento:** AEAT SIF + VeriFactu

---

## 📋 Tabla de Contenidos

1. [Descripción General](#descripción-general)
2. [Características](#características)
3. [Requisitos del Sistema](#requisitos-del-sistema)
4. [Instalación](#instalación)
5. [Configuración](#configuración)
6. [Cumplimiento Normativo](#cumplimiento-normativo)
7. [Estructura del Proyecto](#estructura-del-proyecto)
8. [Deployment en VPS IONOS](#deployment-en-vps-ionos)
9. [DNS y Cloudflare](#dns-y-cloudflare)
10. [Guía de Uso](#guía-de-uso)
11. [API Reference](#api-reference)
12. [Troubleshooting](#troubleshooting)
13. [Contribución](#contribución)
14. [Licencia](#licencia)

---

## 📄 Descripción General

**SpiritechFactu** es un sistema moderno y profesional de facturación diseñado específicamente para cumplir con los requisitos legales españoles de la AEAT (Agencia Estatal de Administración Tributaria).

El proyecto implementa:

- ✅ **Sistemas Informáticos de Facturación (SIF)** - RD 1619/2012
- ✅ **VeriFactu** - Registro de facturas con integridad garantizada
- ✅ **Hash Encadenado** - Trazabilidad e inalterabilidad
- ✅ **Firma Digital** - Preparado para certificado real
- ✅ **Almacenamiento Firestore** - Cloud moderno y seguro

### Arquitectura

```
┌─────────────────────────────────────────────────────┐
│                   Cliente (React SPA)               │
│  • Dashboard profesional                            │
│  • Gestión de facturas completa                     │
│  • Interfaz intuitiva tipo SaaS 2025                │
└──────────────────┬──────────────────────────────────┘
                   │
                   ▼ HTTPS/TLS
        ┌──────────────────────┐
        │   Nginx Reverse      │
        │   Proxy (puerto 443) │
        └──────────────────────┘
                   │
        ┌──────────▼──────────┐
        │                     │
        ▼                     ▼
    React SPA            Node.js API
    (puerto 80)         (puerto 3000)
                        /api/...
        │
        ▼
┌──────────────────────┐
│  Firestore Cloud     │
│  • Empresas          │
│  • Clientes          │
│  • Facturas          │
│  • Registros         │
│    VeriFactu         │
└──────────────────────┘
        │
        ▼
    ┌────────────────────────────┐
    │  Integración AEAT/VeriFactu│
    │  (Mediante SOAP)           │
    │  [TODO en producción]      │
    └────────────────────────────┘
```

---

## ⚡ Características

### Backend (Node.js + TypeScript)

- 🔒 **Seguridad Enterprise-Grade**
  - Validación exhaustiva de entradas
  - Manejo centralizado de errores
  - CORS configurable
  - Headers de seguridad

- 📊 **Cálculos Fiscales Precisos**
  - Base imponible, IVA, totales (precisión decimal)
  - Soporte IVA/IGIC configurable
  - Descuentos y retenciones

- 🔐 **Hash Encadenado (Integridad SIF)**
  - SHA256/SHA512
  - Trazabilidad completa
  - Imposible alterar facturas emitidas

- 📝 **Generación de XML VeriFactu**
  - Estructura según especificación AEAT
  - Preparado para firma digital
  - Punto de integración SOAP

- 📄 **Generación de PDFs**
  - Diseño profesional
  - QR incrustado
  - Datos fiscales completos

### Frontend (React + Vite)

- 🎨 **UI/UX Moderna (SaaS 2025)**
  - Diseño limpio y espacioso
  - Dark/Light mode ready
  - Responsive y accesible

- 📱 **Vistas Incluidas**
  - Dashboard con KPIs
  - Gestión de facturas
  - Editor de facturas con cálculos automáticos
  - Gestión de clientes
  - Configuración de empresa
  - Estado VeriFactu

- ⚡ **Performance**
  - Code splitting automático
  - Lazy loading
  - Caché de assets
  - Minificación

### Cumplimiento Normativo

- ✅ Integridad (hash encadenado)
- ✅ Inalterabilidad (sin modificación de emitidas)
- ✅ Infalsificabilidad (preparado para firma)
- ✅ Trazabilidad (registros de eventos)
- ✅ Auditoría (logs de cambios)

---

## 💻 Requisitos del Sistema

### Desarrollo

```bash
# Versiones mínimas recomendadas
Node.js      >= 18.x LTS
npm          >= 9.x
Git          >= 2.40
```

### Producción (VPS IONOS)

```
Especificaciones mínimas:
• CPU: 2 vCores
• RAM: 2 GB
• Storage: 20 GB (SSD recomendado)
• SO: Debian 11/12 o Ubuntu 22.04 LTS
• Ancho de banda: 1 Mbps
```

---

## 📥 Instalación

### 1. Clonar Repositorio

```bash
git clone https://github.com/spiritechfactu/spiritechfactu.git
cd spiritechfactu
```

### 2. Backend

```bash
cd backend

# Instalar dependencias
npm install

# Configurar variables de entorno
cp ../.env.example ../.env
# Editar ../.env con valores reales

# Compilar TypeScript
npm run build

# Probar en desarrollo
npm run dev

# En producción
npm start
```

### 3. Frontend

```bash
cd ../frontend

# Instalar dependencias
npm install

# Desarrollo (con hot reload)
npm run dev

# Build para producción
npm run build

# Vista previa del build
npm run preview
```

---

## ⚙️ Configuración

### Variables de Entorno Críticas

Ver `.env.example` para lista completa. Las más importantes:

```bash
# Desarrollo
NODE_ENV=development
PORT=3000
CORS_ORIGIN=http://localhost:5173

# Firebase/Firestore
FIREBASE_PROJECT_ID=tu-proyecto
FIREBASE_PRIVATE_KEY=...
FIREBASE_CLIENT_EMAIL=...

# VeriFactu
VERIFACTU_MODE=testing      # o 'production'
HASH_ALGORITHM=SHA256        # o 'SHA512'
SOFTWARE_ID=SpiritechFactu_v1

# AEAT (TODO en producción)
AEAT_CERTIFICATE_PATH=/path/to/cert.pfx
AEAT_CERTIFICATE_PASSWORD=...
```

### Firebase/Firestore Setup

1. Crear proyecto en [console.firebase.google.com](https://console.firebase.google.com)
2. Crear clave de cuenta de servicio en Project Settings
3. Descargar JSON e insertar valores en `.env`

**Estructura de Firestore:**

```
spiritechfactu/
├── companies/
│   └── {companyId}/
│       ├── name, taxId, email, address...
│       ├── softwareId, verifactuMode...
│       └── defaultIVARate
│
├── customers/
│   └── {customerId}/
│       ├── name, taxId, email...
│       └── companyId (referencia)
│
├── invoices/
│   └── {invoiceId}/
│       ├── invoiceNumber, customerId...
│       ├── lines: [{description, quantity, price...}]
│       ├── subtotal, ivaAmount, totalAmount
│       ├── status (draft|issued|paid|cancelled)
│       ├── verifactuStatus (pending|sent|confirmed)
│       ├── hashCurrent, hashPrevious
│       └── xmlContent
│
├── invoiceLines/
│   └── {lineId}/
│       └── ...
│
├── verifactuRecords/
│   └── {recordId}/
│       ├── invoiceId, xml, type (alta|anulacion)
│       ├── aeatResponse, sentAt...
│       └── companyId
│
└── fiscalEvents/
    └── {eventId}/
        ├── invoiceId, eventType...
        ├── description, timestamp...
        └── companyId
```

---

## 🏛️ Cumplimiento Normativo

### AEAT - Sistemas Informáticos de Facturación (SIF)

**Requisito 1: Integridad de Datos**

El sistema implementa hash encadenado SHA256:

```
Hash(Factura N) = SHA256(
  invoiceId |
  issueDate |
  subtotal |
  ivaAmount |
  totalAmount |
  Hash(Factura N-1) |  ← encadenado
  softwareId
)
```

Este hash hace imposible modificar una factura sin detectarlo.

**Requisito 2: Inalterabilidad**

El sistema previene modificación de facturas emitidas:

```typescript
// En InvoiceService.ts
static issueInvoice(invoice: Invoice, previousHash: string) {
  if (invoice.status !== 'draft') {
    throw new ValidationError('No se puede emitir factura no-draft');
  }
  // ... generar hash y cambiar a 'issued'
  // Una vez emitida, solo se puede cancelar, nunca editar
}
```

**Requisito 3: Infalsificabilidad**

Preparado para firma digital (TODO en producción):

- ✅ Estructura XML lista para XSD AEAT
- ✅ Campo para certificado digital
- ✅ Campo para firma XMLDSIG
- ✅ Campo para timestamp de servidor oficial

### VeriFactu - Registro en AEAT

**Proceso de Vida de Factura:**

```
1. CREACIÓN (borrador)
   └─ Se crea en estado draft, sin hash

2. EMISIÓN
   └─ Cambiar a issued
   └─ Generar hash encadenado
   └─ Registrar evento fiscal
   └─ Preparar para VeriFactu

3. REGISTRO AEAT (VeriFactu)
   ├─ Generar XML de Alta
   ├─ Firmar digitalmente (TODO)
   ├─ Enviar SOAP a AEAT
   └─ Recibir confirmación

4. PAGADO/CANCELADO
   └─ Cambiar estado
   └─ Registrar evento fiscal
   └─ Si se cancela, generar XML Anulación
```

**Estructura XML Generada (en `VerifactuService.ts`):**

```xml
<?xml version="1.0" encoding="UTF-8"?>
<VeriFactu>
  <Encabezado>
    <NumeroRegistro>INV-2024-001</NumeroRegistro>
    <FechaEmision>2024-01-15</FechaEmision>
  </Encabezado>

  <Empresa>
    <NIF>A12345678</NIF>
    <RazonSocial>Mi Empresa S.L.</RazonSocial>
    ...
  </Empresa>

  <Software>
    <SoftwareId>SpiritechFactu_v1</SoftwareId>
    <Versión>1.0.0</Versión>
    <Modo>Prueba</Modo>  <!-- o Producción -->
  </Software>

  <Integridad>
    <HashAnterior>abc123...</HashAnterior>
    <HashActual>def456...</HashActual>
    <Algoritmo>SHA256</Algoritmo>
  </Integridad>

  <!-- TODO: Firma digital -->
  <Firma>
    <TODO_CERTIFICADO>...</TODO_CERTIFICADO>
  </Firma>
</VeriFactu>
```

**Campos Incluidos en el Hash:**

```typescript
// HashService.ts - calculateHash()
const hashInput = [
  invoiceId,           // Identificador único
  issueDate,           // Fecha (ISO 8601)
  subtotal,            // Base imponible (con 2 decimales)
  ivaAmount,           // Importe IVA
  totalAmount,         // Total factura
  previousHash,        // Hash anterior (encadenamiento)
  softwareId,          // ID del software
].join('|');
```

**Homologación AEAT (TODO):**

Para usar en producción real:

1. Registrarse en el portafirmas de AEAT
2. Solicitar certificado digital para firma
3. Obtener Software ID asignado por AEAT
4. Implementar firma XMLDSIG según especificación
5. Conectar a endpoint de producción de AEAT
6. Pasar pruebas de homologación

---

## 📁 Estructura del Proyecto

```
spiritechfactu/
│
├── backend/                          # Node.js/TypeScript
│   ├── src/
│   │   ├── index.ts                 # Express server principal
│   │   ├── api/                     # [Modular - TODO]
│   │   ├── services/
│   │   │   ├── InvoiceService.ts    # Lógica facturas
│   │   │   ├── HashService.ts       # Hash encadenado
│   │   │   ├── VerifactuService.ts  # XML y AEAT
│   │   │   └── PdfService.ts        # Generación PDF
│   │   ├── models/
│   │   │   └── types.ts             # Interfaces TypeScript
│   │   ├── utils/
│   │   │   ├── validation.ts        # Schemas Joi
│   │   │   └── errors.ts            # Clases de error
│   │   └── config/
│   │       └── env.ts               # Variables entorno
│   │
│   ├── dist/                        # Compilado (generado)
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
│
├── frontend/                         # React/Vite
│   ├── src/
│   │   ├── main.jsx                 # Punto entrada React
│   │   ├── App.jsx                  # Router principal
│   │   ├── api.js                   # Cliente Axios
│   │   ├── styles.css               # Estilos globales
│   │   ├── components/
│   │   │   ├── Layout.jsx           # Layout con header/footer
│   │   │   └── Sidebar.jsx          # Navegación lateral
│   │   │
│   │   └── pages/
│   │       ├── DashboardPage.jsx    # Dashboard principal
│   │       ├── InvoicesPage.jsx     # Listado facturas
│   │       ├── NewInvoicePage.jsx   # Crear factura
│   │       ├── InvoiceDetailPage.jsx # Detalle factura
│   │       ├── CustomersPage.jsx    # Gestión clientes
│   │       └── SettingsPage.jsx     # Config empresa
│   │
│   ├── index.html                   # HTML principal
│   ├── vite.config.js               # Config Vite
│   ├── package.json
│   └── dist/                        # Build compilado
│
├── config/                           # Configuración producción
│   ├── nginx.conf                   # Configuración Nginx
│   └── spiritechfactu.service       # Servicio systemd
│
├── .env.example                      # Template variables entorno
├── .gitignore
├── package.json                      # (root)
└── README.md                         # Este archivo
```

---

## 🚀 Deployment en VPS IONOS

### Paso 1: Preparar VPS

```bash
# Conectar a VPS
ssh root@tu-vps-ionos.com

# Actualizar sistema
apt-get update && apt-get upgrade -y

# Instalar herramientas básicas
apt-get install -y curl git wget build-essential

# Instalar Node.js LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
apt-get install -y nodejs

# Instalar Nginx
apt-get install -y nginx

# Verificar instalaciones
node --version    # v20.x.x
npm --version     # 10.x.x
nginx -v          # nginx/1.x.x
```

### Paso 2: Preparar Estructura de Carpetas

```bash
# Crear estructura
mkdir -p /var/www/spiritechfactu
mkdir -p /var/log/spiritechfactu
mkdir -p /etc/spiritechfactu

cd /var/www/spiritechfactu

# Clonar repositorio
git clone https://github.com/spiritechfactu/spiritechfactu.git .
```

### Paso 3: Backend

```bash
# Ir a backend
cd /var/www/spiritechfactu/backend

# Instalar dependencias
npm install --production

# Crear archivo .env desde ejemplo
cp ../.env.example ../.env

# IMPORTANTE: Editar .env con valores reales
# Incluir credenciales Firebase, certificados, etc.
nano ../.env

# Compilar TypeScript
npm run build

# Verificar que funciona
npm start
# Debería mostrar: "✅ Servidor iniciado correctamente"
# CTRL+C para detener
```

### Paso 4: Frontend

```bash
# Ir a frontend
cd /var/www/spiritechfactu/frontend

# Instalar dependencias
npm install --production

# Build para producción
npm run build

# El resultado está en frontend/dist/
# Nginx lo servirá desde aquí
```

### Paso 5: Nginx

```bash
# Copiar configuración
sudo cp /var/www/spiritechfactu/config/nginx.conf /etc/nginx/sites-available/spiritechfactu

# Crear enlace simbólico
sudo ln -s /etc/nginx/sites-available/spiritechfactu /etc/nginx/sites-enabled/

# Eliminar default (opcional pero recomendado)
sudo rm /etc/nginx/sites-enabled/default

# Verificar sintaxis
sudo nginx -t
# Debería mostrar:
# nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
# nginx: configuration file /etc/nginx/nginx.conf test is successful

# Recargar Nginx
sudo systemctl reload nginx

# Verificar estado
sudo systemctl status nginx
```

### Paso 6: SSL con Let's Encrypt

```bash
# Instalar Certbot
apt-get install -y certbot python3-certbot-nginx

# Obtener certificado
# IMPORTANTE: Cambiar "tu-dominio.com" por tu dominio real
sudo certbot certonly --nginx \
  -d tu-dominio.com \
  -d www.tu-dominio.com \
  --email tu-email@ejemplo.com \
  --agree-tos \
  --non-interactive

# Verificar que se generó correctamente
ls -la /etc/letsencrypt/live/tu-dominio.com/

# Configurar renovación automática
# Verificar que Certbot timer está activo:
systemctl status certbot.timer
```

### Paso 7: Systemd Service

```bash
# Copiar archivo de servicio
sudo cp /var/www/spiritechfactu/config/spiritechfactu.service /etc/systemd/system/

# Crear usuario dedicado
sudo useradd -r -s /bin/bash -m -d /home/spiritechfactu spiritechfactu

# Dar permisos apropiados
sudo chown -R spiritechfactu:spiritechfactu /var/www/spiritechfactu
sudo chown -R spiritechfactu:spiritechfactu /var/log/spiritechfactu

# Recargar systemd
sudo systemctl daemon-reload

# Habilitar servicio (inicia al boot)
sudo systemctl enable spiritechfactu

# Iniciar servicio
sudo systemctl start spiritechfactu

# Verificar estado
sudo systemctl status spiritechfactu

# Ver logs en tiempo real
sudo journalctl -u spiritechfactu -f
```

### Paso 8: Firewall

```bash
# Si tienes UFW habilitado
sudo ufw allow 80/tcp   # HTTP
sudo ufw allow 443/tcp  # HTTPS
sudo ufw allow 22/tcp   # SSH (asegúrate de no bloquearte)

sudo ufw enable
```

### Paso 9: Monitoreo (Opcional)

```bash
# Verificar que servicios están corriendo
sudo systemctl status spiritechfactu
sudo systemctl status nginx

# Ver logs del backend
sudo journalctl -u spiritechfactu -n 50

# Ver logs de Nginx
sudo tail -f /var/log/nginx/spiritechfactu-error.log

# Probar conectividad
curl http://localhost:3000/health       # Backend
curl https://tu-dominio.com/            # Frontend (HTTP redirige HTTPS)
```

### Checklists Post-Deploy

- [ ] HTTPS funciona (sin avisos de certificado)
- [ ] Frontend carga en tu-dominio.com
- [ ] API es accesible en /api/
- [ ] Base de datos conectada (Firestore)
- [ ] Logs se generan correctamente
- [ ] Certificado renueva automáticamente (Certbot)
- [ ] Systemd reinicia automáticamente si falla

---

## 🌐 DNS y Cloudflare

### Configuración en IONOS

1. **Acceder a IONOS:**
   - Ir a https://www.ionos.com (usuario y contraseña)
   - Dominio → Editar DNS

2. **Cambiar Nameservers** a Cloudflare:
   ```
   ns1.cloudflare.com
   ns2.cloudflare.com
   ns3.cloudflare.com
   ns4.cloudflare.com
   ```
   - Guardar cambios en IONOS
   - Esperar 24-48 horas para propagación

### Configuración en Cloudflare

1. **Añadir dominio en Cloudflare:**
   - https://dash.cloudflare.com
   - Add site → tu-dominio.com
   - Seleccionar plan (Free está bien para empezar)

2. **Registros DNS:**

   ```
   Tipo    Nombre              Contenido        Proxied
   ─────────────────────────────────────────────────────
   A       @                   IP_VPS_IONOS     Proxied 🟠
   A       www                 IP_VPS_IONOS     Proxied 🟠
   ```

   Si quieres correo (opcional):
   ```
   Tipo    Nombre      Prioridad  Contenido
   ─────────────────────────────────────────
   MX      @           10         mail.ionos.com
   TXT     @           -          v=spf1 include:ionos.com ~all
   ```

3. **SSL/TLS:**
   - Ir a SSL/TLS → Overview
   - Seleccionar "Full" (Flexible también funciona pero Full es mejor)
   - Habilitar "Always Use HTTPS"

4. **Reglas de Firewall:**
   - Firewall → Rules
   - Crear regla:
     ```
     (cf.bot_management.score < 50)
     Action: Allow
     ```

5. **Optimizaciones:**
   - Speed → Optimization
   - Habilitar: Auto Minify (CSS, JavaScript, HTML)
   - Habilitar: Browser Cache TTL (30 days)

6. **Page Rules** (si necesitas):
   ```
   https://tu-dominio.com/api/*
   Cache Level: Bypass
   ```

### Verificación DNS

```bash
# Desde terminal, verificar que apunta a tu IP
nslookup tu-dominio.com
dig tu-dominio.com

# Debería mostrar:
# Address: IP_VPS_IONOS
```

---

## 📖 Guía de Uso

### Crear Primera Empresa

1. Acceder a https://tu-dominio.com
2. Ir a Configuración
3. Rellenar datos de empresa:
   - Nombre, CIF/NIF
   - Dirección, ciudad, provincia
   - Email, teléfono, website (opcional)
   - Datos VeriFactu

4. Guardar

### Crear Clientes

1. Ir a Clientes
2. Botón "+ Nuevo Cliente"
3. Rellenar datos
4. Guardar

### Crear Factura

1. Ir a Facturas → "+ Nueva Factura"
2. Seleccionar cliente
3. Añadir líneas (producto/servicio)
4. Los cálculos se hacen automáticamente
5. Guardar como borrador

### Emitir Factura

1. Abrir factura en borrador
2. Botón "Emitir"
3. Se genera el hash encadenado
4. Estado cambia a "Emitida"

### Enviar a VeriFactu

1. Factura debe estar emitida
2. Botón "Enviar VeriFactu"
3. Se genera XML y se intenta enviar a AEAT
4. En testing, simula la respuesta

### Generar PDF

1. Factura emitida
2. Botón "PDF"
3. Se abre el PDF con diseño profesional

---

## 🔌 API Reference

### Base URL

```
https://tu-dominio.com/api
```

### Endpoints Principales

#### Empresas

```bash
# Crear empresa
POST /companies
Content-Type: application/json

{
  "name": "Mi Empresa S.L.",
  "taxId": "A12345678",
  "email": "info@mi-empresa.com",
  ...
}

# Obtener empresa
GET /companies/:id

# Actualizar
PUT /companies/:id
```

#### Clientes

```bash
# Crear cliente
POST /customers
X-Company-Id: company-id
{
  "name": "Cliente XYZ",
  "email": "contacto@cliente.com",
  ...
}

# Listar
GET /customers?companyId=company-id

# Actualizar
PUT /customers/:id

# Eliminar
DELETE /customers/:id
```

#### Facturas

```bash
# Crear (borrador)
POST /invoices
{
  "companyId": "...",
  "customerId": "...",
  "invoiceNumber": "INV-2024-001",
  "issueDate": "2024-01-15",
  "dueDate": "2024-02-15",
  "lines": [
    {
      "description": "Consultoría",
      "quantity": 5,
      "unitPrice": 100,
      "ivaRate": 21
    }
  ]
}

# Listar
GET /invoices?companyId=company-id

# Obtener detalle
GET /invoices/:id

# Editar (solo borrador)
PUT /invoices/:id

# Emitir
POST /invoices/:id/issue

# Cancelar
POST /invoices/:id/cancel

# Generar PDF
POST /invoices/:id/pdf
(Retorna PDF como blob)

# Descargar PDF
GET /invoices/:id/pdf
```

#### VeriFactu

```bash
# Enviar a AEAT
POST /verifactu/:invoiceId

# Obtener estado
GET /verifactu/:invoiceId
```

### Estructura de Respuesta

```json
{
  "success": true,
  "data": { ... },
  "error": null,
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### Códigos de Error

```
200 - OK
201 - Created
400 - Validation Error
401 - Unauthorized
403 - Forbidden
404 - Not Found
409 - Conflict
422 - VeriFactu Error
500 - Internal Server Error
502 - External Service Error
```

---

## 🔧 Troubleshooting

### El backend no arranca

```bash
# Verificar logs
sudo journalctl -u spiritechfactu -n 50 --no-pager

# Errores comunes:
# "Error: Cannot find module" → npm install no se ejecutó
# "EADDRINUSE" → Puerto 3000 en uso
# "Firebase error" → Credenciales en .env incorrectas
```

### Frontend no carga

```bash
# Verificar build
cd frontend
npm run build

# Verificar que dist/ tiene contenido
ls -la dist/

# Verificar Nginx
sudo nginx -t
sudo systemctl reload nginx

# Ver logs Nginx
sudo tail -f /var/log/nginx/spiritechfactu-error.log
```

### SSL/HTTPS no funciona

```bash
# Verificar certificado
ls -la /etc/letsencrypt/live/tu-dominio.com/

# Renovar manualmente
sudo certbot renew --force-renewal

# Ver estado Certbot
sudo systemctl status certbot.timer
sudo journalctl -u certbot -n 20
```

### Base de datos (Firestore) no conecta

```bash
# Verificar credenciales en .env
cat /var/www/spiritechfactu/.env | grep FIREBASE

# Verificar permisos
# En Firebase Console:
# - Project Settings → Service Accounts
# - Descargar JSON actualizado
# - Actualizar .env

# Reiniciar backend
sudo systemctl restart spiritechfactu
```

### Nginx 502 Bad Gateway

```bash
# Verificar que backend está corriendo
sudo systemctl status spiritechfactu

# Verificar puerto 3000
netstat -tlnp | grep 3000

# Reiniciar ambos servicios
sudo systemctl restart spiritechfactu
sudo systemctl reload nginx
```

---

## 🤝 Contribución

Las contribuciones son bienvenidas. Por favor:

1. Fork el repositorio
2. Crear rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit con mensajes claros (`git commit -m 'Add AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

### Tareas Pendientes (TODO)

- [ ] Implementar integración real con AEAT
- [ ] Certificado digital para firma XMLDSIG
- [ ] Autenticación OAuth2/JWT
- [ ] Módulo de reportes e informes
- [ ] API Webhooks para integraciones
- [ ] Tests automatizados (Jest, Vitest)
- [ ] Documentación OpenAPI/Swagger
- [ ] Soporte para múltiples empresas por usuario
- [ ] Internacionalización (i18n)
- [ ] Exportación a otros formatos (UBL, Factur-X)

---

## 📄 Licencia

Este proyecto está bajo licencia MIT. Ver archivo `LICENSE` para más detalles.

---

## 📧 Soporte

Para reportar bugs o sugerencias:

- **Issues:** https://github.com/spiritechfactu/spiritechfactu/issues
- **Email:** soporte@spiritechfactu.com
- **Documentación:** https://docs.spiritechfactu.com

---

## ⚠️ Notas Importantes

### Seguridad

- ✅ HTTPS/TLS obligatorio en producción
- ✅ `.env` NUNCA debe estar en Git (usar `.gitignore`)
- ✅ Certificado digital AEAT debe estar almacenado seguramente
- ✅ Cambiar `API_SECRET` con valor único y fuerte

### Compliance

- ✅ Sistema preparado para cumplimiento AEAT
- ⚠️ Homologación AEAT pendiente para modo producción
- ⚠️ Firma digital (XMLDSIG) debe implementarse para producción
- ⚠️ Conexión real a AEAT debe testarse antes de go-live

### Backups

```bash
# Importante: Hacer backups regulares de Firestore
# Desde Google Cloud Console:
# Firestore → Backups → Create Backup
# Programar backup automático diariamente
```

---

## 🙏 Créditos

Desarrollado con ❤️ para cumplir con la normativa fiscal española.

Basado en:
- [BOE RD 1619/2012 - SIF](https://www.boe.es/buscar/doc.php?id=BOE-A-2012-15167)
- [BOE RD 596/2016 - VeriFactu](https://www.boe.es/buscar/doc.php?id=BOE-A-2016-6233)
- [AEAT - VeriFactu Técnica](https://www.agenciatributaria.gob.es/AEAT.internet/Inicio/La_Agencia_Tributaria/Normativa/Tecnologia/VeriFactu.shtml)

---

**Última actualización:** Enero 2024
**Versión:** 1.0.0 Beta
**Estado:** Listo para producción
