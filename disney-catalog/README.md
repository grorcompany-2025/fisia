# 🎨 Disney100 x Romero Britto - Catálogo Mágico

Proyecto web estático compatible con Railway, con estética Disney 100 años combinada con el estilo vibrante de Romero Britto.

---

## ✨ Características

- **🎨 Estilo Visual Único**: Paleta Disney100 (morado, plata) + Romero Britto (rosa fuerte, azul brillante, amarillo)
- **🖼️ Diseño Pop Art**: Bordes gruesos, sombras suaves, tarjetas estilo juguete premium
- **📱 Responsive**: Funciona perfecto en desktop, tablet y móvil
- **⚡ Sin Backend**: 100% estático, funciona offline
- **🔧 Panel Admin**: Gestiona productos sin necesidad de servidor

---

## 📁 Estructura del Proyecto

```
disney-catalog/
├── index.html           # Catálogo de productos
├── admin.html          # Panel de administración
├── products.json       # Base de datos de productos
├── static.json         # Configuración Railway
├── Dockerfile          # 🐳 Configuración Docker
├── docker-compose.yml  # 🐳 Orquestación Docker
├── nginx.conf          # 🐳 Configuración Nginx
├── package.json        # Scripts NPM para Docker
├── .dockerignore       # Archivos ignorados por Docker
├── css/
│   └── styles.css      # Estilos Disney100 + Britto
├── js/
│   ├── app.js          # Lógica del catálogo
│   └── admin.js        # Lógica del admin
└── assets/
    └── placeholder.png # Imagen placeholder
```

---

## 🚀 Deployment en Railway

### Opción 1: Docker (⭐ Recomendado)

Railway detecta automáticamente el Dockerfile y lo despliega:

1. **Sube el proyecto a GitHub**
2. **Conecta Railway a tu repositorio**
3. **Railway detecta el Dockerfile automáticamente**
4. **Deploy automático con Docker** ✅

**Ventajas:**
- ✅ Control total sobre el entorno
- ✅ Nginx optimizado para servir archivos estáticos
- ✅ Caché configurado para mejor performance
- ✅ Health checks integrados
- ✅ Gzip compression automática

### Opción 2: Heroku Static Buildpack

1. **Sube el proyecto a GitHub**
2. **Conecta Railway a tu repositorio**
3. **Configura el buildpack:**
   ```
   BUILDPACK_URL=https://github.com/heroku/heroku-buildpack-static
   ```
4. **Deploy automático** ✅

### Opción 3: Paketo Buildpacks

1. **Crea un nuevo proyecto en Railway**
2. **Sube el ZIP directamente**
3. **Railway detecta automáticamente** el static.json
4. **Deploy en segundos** ✅

### Variables de Entorno (Opcional)

No se requieren variables de entorno. El proyecto funciona out-of-the-box.

---

## 📝 Cómo Usar

### Catálogo (index.html)

- **Buscar productos**: Usa la barra de búsqueda
- **Filtrar por categoría**: Selecciona una categoría del dropdown
- **Ver detalles**: Cada tarjeta muestra nombre, precio, categoría y descripción

### Panel Admin (admin.html)

1. **Crear Producto**:
   - Rellena el formulario
   - Haz clic en "Guardar Producto"

2. **Editar Producto**:
   - Haz clic en "Editar" en cualquier producto
   - Modifica los campos
   - Guarda los cambios

3. **Eliminar Producto**:
   - Haz clic en "Eliminar"
   - Confirma la acción

4. **Descargar JSON**:
   - Haz clic en "Descargar products.json"
   - Reemplaza el archivo en tu proyecto
   - Sube a Railway para aplicar cambios

---

## 🎨 Paleta de Colores

```css
--disney-purple: #5D2E8C    /* Morado Disney100 */
--disney-silver: #C0C0C0    /* Plata */
--britto-pink: #FF1493      /* Rosa Fuerte Britto */
--britto-blue: #00BFFF      /* Azul Brillante */
--britto-yellow: #FFD700    /* Amarillo Britto */
--britto-orange: #FF6347    /* Naranja */
--britto-green: #00FF7F     /* Verde */
```

---

## 🛠 Tecnologías

- **HTML5**: Estructura semántica
- **CSS3**: Variables CSS, Grid, Flexbox, Gradientes
- **JavaScript (Vanilla)**: Sin frameworks
- **JSON**: Base de datos de productos
- **Google Fonts**: Poppins (tipografía alegre)

---

## 📦 Instalación Local

### Opción 1: Sin servidor (archivos estáticos)

```bash
# 1. Descarga o clona el proyecto
git clone <repository-url>
cd disney-catalog

# 2. Abre index.html en tu navegador
# Opción A: Doble clic en index.html
# Opción B: Servidor local con Python
python -m http.server 8000
# Luego abre http://localhost:8000
```

### Opción 2: Con Docker 🐳 (⭐ Recomendado)

#### Usando Docker Compose

```bash
# 1. Clonar repositorio
git clone <repository-url>
cd disney-catalog

# 2. Construir y levantar (en segundo plano)
docker-compose up -d --build

# 3. Acceder en el navegador
# http://localhost:8080

# Ver logs en tiempo real
docker-compose logs -f

# Detener contenedor
docker-compose down
```

#### Usando Docker directamente

```bash
# 1. Construir imagen
docker build -t disney-catalog .

# 2. Ejecutar contenedor
docker run -d -p 8080:80 --name disney-catalog-app disney-catalog

# 3. Acceder en el navegador
# http://localhost:8080

# Ver logs
docker logs -f disney-catalog-app

# Detener y eliminar
docker stop disney-catalog-app
docker rm disney-catalog-app
```

#### Usando NPM scripts

```bash
# Construir y ejecutar con Docker
npm run docker:build
npm run docker:run

# Ver logs
npm run docker:logs

# Detener
npm run docker:stop

# Usando Docker Compose
npm run compose:up
npm run compose:logs
npm run compose:down
```

### Opción 3: Servidor Node.js simple

```bash
# Instalar http-server globalmente
npm install -g http-server

# Ejecutar en puerto 8080
http-server -p 8080

# Acceder a http://localhost:8080
```

---

## 🎯 Características del Diseño

### Estética Disney 100 Años
- ✨ Elementos mágicos (estrellas, destellos)
- 🏰 Paleta oficial del centenario
- 🎭 Tipografía bold y llamativa

### Estilo Romero Britto
- 🎨 Pop Art vibrante
- 🌈 Colores saturados y alegres
- 📐 Bordes gruesos negros
- ✏️ Patrón de juguete premium

---

## 📱 Responsive Design

El sitio se adapta automáticamente a:
- 📱 **Mobile**: 320px - 768px
- 💻 **Tablet**: 768px - 1024px
- 🖥️ **Desktop**: 1024px+

---

## 🔒 Seguridad

- ✅ No hay backend ni base de datos
- ✅ No se almacenan datos sensibles
- ✅ Funciona 100% en el navegador
- ✅ HTTPS automático en Railway
- ✅ Headers de seguridad configurados en Nginx
- ✅ Protección contra XSS y clickjacking

---

## 🐳 Docker - Configuración Detallada

### Dockerfile

El proyecto usa **nginx:alpine** como imagen base (solo ~5MB):

```dockerfile
FROM nginx:alpine

# Copiar archivos estáticos
COPY . /usr/share/nginx/html/

# Copiar configuración nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exponer puerto 80
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s \
  CMD wget --quiet --tries=1 --spider http://localhost:80/ || exit 1
```

### Nginx Configuration

Configuración optimizada para archivos estáticos:

- ✅ **Gzip compression** para CSS, JS, JSON
- ✅ **Cache headers** para assets (1 año)
- ✅ **Security headers** (X-Frame-Options, CSP)
- ✅ **SPA routing** (todas las rutas van a index.html)
- ✅ **Error handling** personalizado

### Docker Compose

Orquestación completa con health checks:

```yaml
services:
  disney-catalog:
    build: .
    ports:
      - "8080:80"
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "wget", "--quiet", "http://localhost:80/"]
      interval: 30s
```

### Ventajas de Docker

1. **Portabilidad**: Funciona igual en cualquier plataforma
2. **Aislamiento**: No interfiere con otros servicios
3. **Reproducibilidad**: Build consistente siempre
4. **Performance**: Nginx optimizado para estáticos
5. **Escalabilidad**: Fácil de escalar horizontalmente
6. **CI/CD**: Integración con Railway, Kubernetes, etc.

### Comandos Útiles

```bash
# Ver contenedores corriendo
docker ps

# Ver logs
docker logs -f <container-id>

# Acceder al contenedor
docker exec -it <container-id> sh

# Ver uso de recursos
docker stats

# Limpiar imágenes sin usar
docker image prune

# Reconstruir sin cache
docker-compose build --no-cache
```

---

## 🐛 Solución de Problemas

### Los productos no cargan
- Verifica que `products.json` está en la raíz
- Abre la consola del navegador (F12) para ver errores
- Asegúrate de que el JSON es válido

### El admin no guarda cambios
- El admin descarga un nuevo `products.json`
- Debes reemplazar el archivo manualmente en Railway
- Railway no permite escritura en disco (por diseño)

### Las imágenes no cargan
- Usa rutas relativas: `assets/imagen.png`
- O URLs completas: `https://ejemplo.com/imagen.png`
- El placeholder por defecto es `assets/placeholder.png`

### Docker: Puerto ya en uso
```bash
# Ver qué está usando el puerto 8080
lsof -i :8080  # Mac/Linux
netstat -ano | findstr :8080  # Windows

# Cambiar el puerto en docker-compose.yml
ports:
  - "3000:80"  # Usa puerto 3000 en vez de 8080
```

### Docker: La imagen no construye
```bash
# Limpiar cache de Docker
docker system prune -a

# Reconstruir desde cero
docker-compose build --no-cache
```

### Railway: El contenedor no arranca
- Verifica que el Dockerfile está en la raíz
- Railway detecta automáticamente el Dockerfile
- Revisa los logs en Railway dashboard
- El puerto debe ser 80 (Railway mapea automáticamente)

---

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

---

## 👨‍💻 Autor

Creado con ❤️ combinando la magia de Disney con el arte vibrante de Romero Britto.

---

## 🎉 ¡Disfruta!

Si te gusta este proyecto, ¡compártelo! ⭐

**Visita el catálogo:** [Tu URL de Railway]
