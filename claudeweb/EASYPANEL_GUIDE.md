# 🚀 Guía de Instalación en Easypanel (IONOS VPS)

Esta guía te llevará paso a paso para desplegar **ClaudeWeb** en tu VPS de IONOS usando Easypanel.

---

## 📋 Prerequisitos

1. **VPS IONOS activo** con acceso SSH
2. **Easypanel instalado** en tu VPS
3. **Dominio apuntando a tu VPS** (opcional pero recomendado)

---

## 🔧 Paso 1: Instalar Easypanel (si no lo tienes)

Si aún no tienes Easypanel instalado en tu VPS de IONOS:

```bash
# 1. Conectar por SSH a tu VPS
ssh root@tu-vps-ip

# 2. Instalar Easypanel
curl -sSL https://get.easypanel.io | sh

# 3. Esperar a que termine la instalación (2-3 minutos)
# Al finalizar te dará la URL de acceso
```

Accede a Easypanel en: `https://tu-vps-ip:3000`

---

## 📦 Paso 2: Preparar el Repositorio

### Opción A: Desde GitHub (Recomendado)

1. **Sube el código a GitHub**
   ```bash
   # En tu máquina local, dentro de la carpeta claudeweb/
   git init
   git add .
   git commit -m "Initial commit: ClaudeWeb"
   git remote add origin https://github.com/tu-usuario/claudeweb.git
   git push -u origin main
   ```

### Opción B: Subir archivos directamente al VPS

```bash
# Desde tu máquina local
scp -r claudeweb/ root@tu-vps-ip:/root/

# Luego en el VPS
ssh root@tu-vps-ip
cd /root/claudeweb
```

---

## 🎯 Paso 3: Crear Aplicación en Easypanel

1. **Accede a Easypanel**
   - Abre `https://tu-vps-ip:3000` en tu navegador
   - Inicia sesión con tus credenciales

2. **Crear nuevo proyecto**
   - Click en **"+ Create Project"**
   - Nombre: `ClaudeWeb` (o el que prefieras)
   - Click en **"Create"**

3. **Agregar servicio - Backend**
   - Dentro del proyecto, click en **"+ Add Service"**
   - Selecciona **"Docker Image"**
   - Nombre: `backend`

   **Configuración:**
   ```yaml
   Image Build:
     Context: ./backend
     Dockerfile: Dockerfile

   Ports:
     - Container Port: 3001
       Published Port: 3001

   Environment Variables:
     PORT: 3001
     NODE_ENV: production

   Restart Policy: unless-stopped

   Health Check:
     Command: node -e "require('http').get('http://localhost:3001/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"
     Interval: 30s
     Timeout: 3s
     Retries: 3
   ```

4. **Agregar servicio - Frontend**
   - Click en **"+ Add Service"** nuevamente
   - Selecciona **"Docker Image"**
   - Nombre: `frontend`

   **Configuración:**
   ```yaml
   Image Build:
     Context: ./frontend
     Dockerfile: Dockerfile

   Ports:
     - Container Port: 80
       Published Port: 80

   Build Args:
     VITE_API_URL: http://tu-vps-ip:3001

   Restart Policy: unless-stopped

   Depends On:
     - backend
   ```

5. **Deploy**
   - Click en **"Deploy"** en cada servicio
   - Espera a que se construyan las imágenes (primera vez toma 5-10 min)
   - Verifica que ambos servicios estén en estado **"Running"** (verde)

---

## 🌐 Paso 4: Configurar Dominio (Opcional pero Recomendado)

### En Easypanel:

1. **Agregar dominio al proyecto**
   - Ve a tu proyecto en Easypanel
   - Click en **"Domains"**
   - Click en **"+ Add Domain"**
   - Ingresa tu dominio: `claudeweb.tu-dominio.com`
   - Target: Selecciona el servicio `frontend`
   - Click en **"Add"**

2. **Configurar SSL**
   - Easypanel automáticamente solicitará un certificado Let's Encrypt
   - Espera 1-2 minutos para que se active

### En tu proveedor DNS (ej: Cloudflare):

1. **Agregar registro DNS**
   ```
   Tipo: A
   Nombre: claudeweb (o @)
   Contenido: IP-de-tu-VPS
   TTL: Auto
   Proxy: Desactivado (para primera configuración)
   ```

2. **Esperar propagación DNS** (5-15 minutos)

---

## 🔐 Paso 5: Configurar API Key

1. **Accede a tu aplicación**
   - `http://tu-vps-ip` o `https://claudeweb.tu-dominio.com`

2. **Abre Configuración**
   - Click en el icono de engranaje (⚙️) arriba a la derecha

3. **Ingresa tu API Key de Anthropic**
   - Ve a [console.anthropic.com](https://console.anthropic.com)
   - Genera o copia tu API Key
   - Pégala en el campo "API Key de Anthropic"
   - Selecciona el modelo (recomendado: Claude 3.5 Sonnet)
   - Click en **"Guardar Configuración"**

4. **¡Empieza a chatear!**
   - Escribe tu primer mensaje en el chat
   - Presiona Enter o click en el botón de enviar

---

## ✅ Verificación

### Comprobar que todo funciona:

```bash
# Conectar por SSH
ssh root@tu-vps-ip

# Ver contenedores corriendo
docker ps

# Deberías ver algo como:
# CONTAINER ID   IMAGE                    STATUS
# abc123...      claudeweb_frontend      Up 5 minutes
# def456...      claudeweb_backend       Up 5 minutes

# Ver logs del backend
docker logs -f <container-id-backend>

# Ver logs del frontend
docker logs -f <container-id-frontend>
```

### Pruebas desde el navegador:

1. **Health Check Backend**
   - Visita: `http://tu-vps-ip:3001/health`
   - Deberías ver: `{"status":"ok","timestamp":"...","version":"1.0.0"}`

2. **Frontend**
   - Visita: `http://tu-vps-ip` o tu dominio
   - Deberías ver la interfaz de chat

3. **Chat funcionando**
   - Configura tu API Key
   - Envía un mensaje de prueba
   - Claude debería responder en segundos

---

## 🛠️ Comandos Útiles en Easypanel

### Ver logs en tiempo real:
1. Ve a tu servicio en Easypanel
2. Click en **"Logs"**
3. Los logs se actualizan automáticamente

### Reiniciar un servicio:
1. Ve al servicio
2. Click en **"Restart"**

### Rebuild desde cero:
1. Ve al servicio
2. Click en **"Rebuild"**
3. Espera a que termine el build

### Eliminar y recrear:
1. Click en **"Delete Service"**
2. Crear nuevamente siguiendo el Paso 3

---

## 🔄 Actualizar la Aplicación

Cuando hagas cambios en el código:

### Si usas GitHub:

1. **Push cambios a GitHub**
   ```bash
   git add .
   git commit -m "Actualización: nueva característica"
   git push origin main
   ```

2. **En Easypanel**
   - Ve a tu servicio
   - Click en **"Rebuild"**
   - Espera a que termine

### Si subes archivos directamente:

1. **Sube archivos al VPS**
   ```bash
   scp -r claudeweb/ root@tu-vps-ip:/root/
   ```

2. **Rebuild en Easypanel**
   - Ve a tu servicio
   - Click en **"Rebuild"**

---

## 🐛 Troubleshooting Easypanel

### Error: "Build failed"

**Solución:**
- Ve a los logs del build en Easypanel
- Verifica que todos los archivos estén presentes
- Comprueba que los Dockerfile sean correctos
- Rebuild desde cero

### Error: "Service unhealthy"

**Solución:**
```bash
# Conectar por SSH
ssh root@tu-vps-ip

# Ver logs del servicio
docker logs <container-id>

# Reiniciar el servicio desde Easypanel
```

### Puerto ya en uso

**Solución:**
- Cambia el puerto publicado en la configuración de Easypanel
- Ejemplo: en vez de `80`, usa `8080`
- Actualiza las URLs en consecuencia

### Frontend no se conecta al Backend

**Solución:**
1. Verifica que `VITE_API_URL` apunte correctamente al backend
2. En Easypanel, asegúrate de que el build arg esté correcto
3. Rebuild el frontend con la URL correcta

---

## 🎉 ¡Listo!

Tu **ClaudeWeb** debería estar funcionando perfectamente en tu VPS de IONOS con Easypanel.

### Próximos pasos:

- ✅ Configura un dominio personalizado
- ✅ Activa HTTPS/SSL
- ✅ Comparte el acceso con tu equipo
- ✅ Explora las funcionalidades de Claude AI

---

## 📞 ¿Necesitas ayuda?

- **Documentación Easypanel:** [easypanel.io/docs](https://easypanel.io/docs)
- **Documentación Anthropic:** [docs.anthropic.com](https://docs.anthropic.com)
- **Issues del proyecto:** GitHub Issues

---

**¡Disfruta de tu nueva interfaz web para Claude AI! 🚀**
