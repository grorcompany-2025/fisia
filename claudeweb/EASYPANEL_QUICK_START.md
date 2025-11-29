# ⚡ Guía Rápida - Easypanel

## Opción más fácil: Docker Compose desde Easypanel

### Paso 1: Accede a tu proyecto en Easypanel

Ya tienes el proyecto "claudecode" creado. Perfecto.

### Paso 2: Agregar servicio desde Docker Compose

1. **Click en "Personalizado"** (la pestaña que ya tienes abierta)

2. **Opción A: Desde GitHub**
   - Si tu código está en GitHub, click en "Desde repositorio"
   - Pega la URL de tu repo
   - Selecciona la carpeta `claudeweb/`
   - Easypanel detectará automáticamente el `docker-compose.yml`

3. **Opción B: Crear desde esquema (lo que muestra tu pantalla)**
   - Click en **"Crear desde esquema"**
   - Pega el contenido del archivo `docker-compose.yml` que creé
   - O copia el contenido de abajo

---

## 📋 Contenido para pegar en Easypanel

Copia y pega esto en el editor de Easypanel:

```yaml
version: '3.8'

services:
  backend:
    build:
      context: https://github.com/tu-usuario/tu-repo.git#main:claudeweb/backend
    restart: unless-stopped
    ports:
      - "3001:3001"
    environment:
      - PORT=3001
      - NODE_ENV=production
    healthcheck:
      test: ["CMD", "node", "-e", "require('http').get('http://localhost:3001/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"]
      interval: 30s
      timeout: 3s
      retries: 3

  frontend:
    build:
      context: https://github.com/tu-usuario/tu-repo.git#main:claudeweb/frontend
    restart: unless-stopped
    ports:
      - "80:80"
    depends_on:
      - backend
```

**Importante:** Reemplaza `tu-usuario/tu-repo` con tu repositorio real de GitHub.

---

## 🚀 Opción alternativa: Crear servicios manualmente

Si prefieres más control, crea cada servicio por separado:

### Servicio 1: Backend

1. Click en **"+ Servicio"**
2. Selecciona **"App"**
3. Configuración:
   - **Nombre:** `claudeweb-backend`
   - **Tipo:** Docker Build
   - **Repositorio:** `https://github.com/tu-usuario/tu-repo.git`
   - **Branch:** `main`
   - **Dockerfile Path:** `claudeweb/backend/Dockerfile`
   - **Context:** `claudeweb/backend`

4. **Puertos:**
   - Container Port: `3001`
   - Public Port: `3001`

5. **Variables de entorno:**
   ```
   PORT=3001
   NODE_ENV=production
   ```

6. Click en **"Crear"**

### Servicio 2: Frontend

1. Click en **"+ Servicio"** nuevamente
2. Selecciona **"App"**
3. Configuración:
   - **Nombre:** `claudeweb-frontend`
   - **Tipo:** Docker Build
   - **Repositorio:** `https://github.com/tu-usuario/tu-repo.git`
   - **Branch:** `main`
   - **Dockerfile Path:** `claudeweb/frontend/Dockerfile`
   - **Context:** `claudeweb/frontend`

4. **Puertos:**
   - Container Port: `80`
   - Public Port: `80`

5. **Build Args:**
   ```
   VITE_API_URL=http://tu-vps-ip:3001
   ```

6. **Depends On:** Selecciona `claudeweb-backend`

7. Click en **"Crear"**

---

## 🌐 Configurar dominio (Opcional)

1. En tu servicio **frontend**, ve a la sección **"Domains"**
2. Click en **"+ Add Domain"**
3. Ingresa tu dominio: `claudeweb.tu-dominio.com`
4. Easypanel configurará automáticamente SSL con Let's Encrypt

---

## ✅ Verificar que funciona

1. **Health check backend:**
   - Visita: `http://tu-vps-ip:3001/health`
   - Deberías ver: `{"status":"ok",...}`

2. **Interfaz web:**
   - Visita: `http://tu-vps-ip`
   - Deberías ver la interfaz de chat de ClaudeWeb

3. **Configurar API Key:**
   - Click en ⚙️ (configuración)
   - Pega tu API Key de Anthropic
   - Selecciona modelo
   - ¡Empieza a chatear!

---

## 🎯 Flujo completo desde cero

```bash
# 1. Subir código a GitHub (si no lo has hecho)
cd claudeweb
git init
git add .
git commit -m "ClaudeWeb inicial"
git remote add origin https://github.com/tu-usuario/claudeweb.git
git push -u origin main

# 2. En Easypanel:
#    - Ir a "Personalizado"
#    - Click "Crear desde esquema"
#    - Pegar el docker-compose.yml
#    - Reemplazar URLs con tu repo
#    - Click "Deploy"

# 3. Esperar 5-10 minutos (primera vez)

# 4. Acceder a http://tu-vps-ip

# 5. Configurar API Key y listo!
```

---

## 💡 Consejos

- **Primera vez tarda más:** El primer despliegue toma 5-10 minutos mientras construye las imágenes
- **Ver logs:** En Easypanel, cada servicio tiene una pestaña "Logs" para debug
- **Reiniciar:** Si algo falla, simplemente click en "Restart" en el servicio
- **Actualizar:** Después de hacer cambios al código, click en "Rebuild"

---

## ❓ Problemas comunes

### Error: "Repository not found"
- Asegúrate de que tu repo sea público o configura un token de acceso

### Error: "Build failed"
- Verifica que las rutas sean correctas: `claudeweb/backend/Dockerfile`
- Mira los logs del build en Easypanel

### Frontend no se conecta al backend
- Verifica que `VITE_API_URL` apunte a `http://tu-vps-ip:3001`
- O usa el dominio interno si ambos están en Easypanel

---

**¡Eso es todo! Con esto deberías poder desplegar ClaudeWeb en minutos.** 🚀
