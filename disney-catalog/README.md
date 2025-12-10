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

### Opción 1: Heroku Static Buildpack

1. **Sube el proyecto a GitHub**
2. **Conecta Railway a tu repositorio**
3. **Configura el buildpack:**
   ```
   BUILDPACK_URL=https://github.com/heroku/heroku-buildpack-static
   ```
4. **Deploy automático** ✅

### Opción 2: Paketo Buildpacks

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

```bash
# 1. Descarga o clona el proyecto
git clone <repository-url>
cd disney-catalog

# 2. Abre index.html en tu navegador
# Opción A: Doble clic en index.html
# Opción B: Servidor local
python -m http.server 8000
# Luego abre http://localhost:8000
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
