# 💬 ClaudeWeb - Interfaz Web para Claude AI

Una interfaz web moderna y sencilla para interactuar con Claude AI de Anthropic. Desplegable fácilmente en cualquier VPS con Docker, especialmente optimizado para **Easypanel en IONOS VPS**.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

---

## 🎯 Características

✅ **Interfaz de chat moderna y responsive**
✅ **Soporte para múltiples modelos de Claude**
✅ **API Key configurable desde el frontend** (cada usuario usa su propia key)
✅ **Despliegue fácil con Docker y Docker Compose**
✅ **Compatible con Easypanel**
✅ **Rate limiting incluido**
✅ **Sin base de datos requerida**
✅ **Almacenamiento de API Key en localStorage del navegador**

---

## 📦 Stack Tecnológico

### Backend
- **Node.js 18+** - Runtime
- **Express** - Framework web
- **@anthropic-ai/sdk** - SDK oficial de Anthropic
- **CORS** - Habilitado para frontend
- **Rate limiting** - Protección contra abuso

### Frontend
- **React 18** - UI Library
- **Vite** - Build tool
- **Axios** - Cliente HTTP
- **Lucide React** - Iconos modernos

### DevOps
- **Docker** - Containerización
- **Docker Compose** - Orquestación
- **Nginx** - Servidor web para frontend
- **Easypanel** - Deployment panel

---

## 🚀 Instalación Rápida

### Opción 1: Easypanel (Recomendado para IONOS VPS)

1. **Accede a tu Easypanel**
   ```
   https://tu-vps-ip:3000
   ```

2. **Crea una nueva aplicación**
   - Click en "Create Application"
   - Nombre: `claudeweb`
   - Tipo: `Docker Compose`

3. **Copia el contenido del `docker-compose.yml`**
   - Pega el contenido en el editor
   - Ajusta los puertos si es necesario

4. **Variables de entorno** (opcional)
   ```env
   PORT=3001
   NODE_ENV=production
   ```

5. **Deploy**
   - Click en "Deploy"
   - Espera a que se construyan las imágenes
   - ¡Listo! Accede a `http://tu-vps-ip`

### Opción 2: Docker Compose Manual

```bash
# 1. Clonar el repositorio
git clone <tu-repo> claudeweb
cd claudeweb

# 2. Construir y levantar los servicios
docker-compose up -d --build

# 3. Verificar que estén corriendo
docker-compose ps

# 4. Ver logs
docker-compose logs -f

# 5. Acceder
# Frontend: http://localhost
# Backend: http://localhost:3001
```

### Opción 3: Desarrollo Local

**Backend:**
```bash
cd backend
npm install
npm run dev
# Corre en http://localhost:3001
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
# Corre en http://localhost:5173
```

---

## ⚙️ Configuración

### 1. Obtener API Key de Anthropic

1. Ve a [console.anthropic.com](https://console.anthropic.com)
2. Inicia sesión o crea una cuenta
3. Ve a "API Keys"
4. Crea una nueva API Key
5. Copia la key (comienza con `sk-ant-api...`)

### 2. Configurar en la Interfaz Web

1. Accede a la aplicación web
2. Click en el icono de configuración (⚙️)
3. Pega tu API Key
4. Selecciona el modelo deseado
5. Click en "Guardar Configuración"

**Nota:** La API Key se guarda en el `localStorage` del navegador, nunca se envía ni almacena en el servidor.

---

## 🌐 Despliegue en Producción (VPS IONOS)

### Prerequisitos

```bash
# Actualizar sistema
apt-get update && apt-get upgrade -y

# Instalar Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Instalar Docker Compose
apt-get install -y docker-compose

# (Opcional) Instalar Easypanel
curl -sSL https://get.easypanel.io | sh
```

### Configuración de Nginx (si no usas Easypanel)

Si quieres usar tu propio Nginx como proxy reverso:

```nginx
# /etc/nginx/sites-available/claudeweb
server {
    listen 80;
    server_name tu-dominio.com;

    # Frontend
    location / {
        proxy_pass http://localhost:80;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header Host $host;
    }
}
```

Activar configuración:
```bash
ln -s /etc/nginx/sites-available/claudeweb /etc/nginx/sites-enabled/
nginx -t
systemctl reload nginx
```

### SSL con Let's Encrypt

```bash
# Instalar certbot
apt-get install -y certbot python3-certbot-nginx

# Obtener certificado
certbot --nginx -d tu-dominio.com

# Renovación automática
certbot renew --dry-run
```

---

## 📊 Arquitectura

```
┌─────────────────────────────────────────────┐
│              CLIENTE (Browser)              │
│         http://tu-dominio.com               │
└─────────────────┬───────────────────────────┘
                  │
                  ↓
┌─────────────────────────────────────────────┐
│              NGINX (Puerto 80)              │
│    • Sirve frontend (React SPA)             │
│    • Proxy reverso para /api                │
└─────────────────┬───────────────────────────┘
                  │
         ┌────────┴────────┐
         │                 │
         ↓                 ↓
┌─────────────────┐ ┌─────────────────┐
│   FRONTEND      │ │    BACKEND      │
│   (React/Vite)  │ │  (Node.js/      │
│   Puerto: 80    │ │   Express)      │
│                 │ │   Puerto: 3001  │
└─────────────────┘ └────────┬────────┘
                             │
                             ↓
                    ┌─────────────────┐
                    │  Anthropic API  │
                    │  Claude AI      │
                    └─────────────────┘
```

---

## 🔐 Seguridad

### Mejores Prácticas

1. **API Keys**
   - Nunca compartas tu API Key de Anthropic
   - La key se guarda solo en el navegador (localStorage)
   - El backend no almacena ninguna API Key

2. **Rate Limiting**
   - Implementado en el backend (100 requests / 15 min)
   - Previene abuso del servicio

3. **CORS**
   - Configurado para permitir solo orígenes necesarios
   - En producción, especifica tu dominio exacto

4. **HTTPS**
   - Siempre usa HTTPS en producción
   - Configura SSL con Let's Encrypt (gratis)

5. **Variables de Entorno**
   - Nunca commits archivos `.env` al repositorio
   - Usa `.env.example` como plantilla

---

## 🎨 Modelos Disponibles

| Modelo | ID | Descripción | Uso Recomendado |
|--------|----|--------------|--------------------|
| **Claude 3.5 Sonnet** | `claude-3-5-sonnet-20241022` | Equilibrio perfecto entre inteligencia y velocidad | ✅ Recomendado para uso general |
| **Claude 3.5 Haiku** | `claude-3-5-haiku-20241022` | Más rápido y económico | Respuestas rápidas, tareas simples |
| **Claude 3 Opus** | `claude-3-opus-20240229` | El más potente y preciso | Tareas complejas, análisis profundo |

---

## 🛠️ Comandos Útiles

### Docker Compose

```bash
# Iniciar servicios
docker-compose up -d

# Ver logs
docker-compose logs -f

# Ver logs solo del backend
docker-compose logs -f backend

# Parar servicios
docker-compose down

# Reconstruir imágenes
docker-compose up -d --build

# Ver estado
docker-compose ps

# Reiniciar un servicio
docker-compose restart backend
```

### Gestión Manual de Contenedores

```bash
# Listar contenedores
docker ps

# Ver logs de un contenedor
docker logs -f claudeweb-backend

# Entrar a un contenedor
docker exec -it claudeweb-backend sh

# Ver uso de recursos
docker stats
```

---

## 📖 API Reference

### Endpoints Backend

#### `GET /health`
Health check del servidor

**Respuesta:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "version": "1.0.0"
}
```

#### `POST /api/chat`
Enviar mensaje a Claude AI

**Request:**
```json
{
  "messages": [
    {
      "role": "user",
      "content": "Hola Claude"
    }
  ],
  "apiKey": "sk-ant-api...",
  "model": "claude-3-5-sonnet-20241022",
  "maxTokens": 4096
}
```

**Response:**
```json
{
  "success": true,
  "response": "Hola! ¿En qué puedo ayudarte hoy?",
  "usage": {
    "input_tokens": 10,
    "output_tokens": 15
  },
  "model": "claude-3-5-sonnet-20241022"
}
```

#### `GET /api/models`
Listar modelos disponibles

**Respuesta:**
```json
{
  "models": [
    {
      "id": "claude-3-5-sonnet-20241022",
      "name": "Claude 3.5 Sonnet",
      "description": "El modelo más inteligente y equilibrado",
      "recommended": true
    }
  ]
}
```

---

## 🐛 Troubleshooting

### Error: "API Key inválida"

**Causa:** La API Key proporcionada no es válida o ha expirado.

**Solución:**
1. Ve a [console.anthropic.com](https://console.anthropic.com)
2. Verifica que tu API Key sea válida
3. Genera una nueva si es necesario
4. Actualiza la key en la configuración

### Error: "CORS blocked"

**Causa:** El frontend intenta conectarse al backend desde un origen diferente.

**Solución:**
1. Verifica que `VITE_API_URL` apunte al backend correcto
2. Asegúrate de que CORS esté habilitado en el backend
3. En producción, usa un proxy reverso (Nginx)

### Error: "Connection refused"

**Causa:** El backend no está corriendo o no es accesible.

**Solución:**
```bash
# Verificar que el backend esté corriendo
docker-compose ps

# Ver logs del backend
docker-compose logs backend

# Reiniciar servicios
docker-compose restart
```

### Frontend no carga

**Causa:** Build del frontend falló o Nginx no está configurado correctamente.

**Solución:**
```bash
# Reconstruir frontend
docker-compose up -d --build frontend

# Ver logs
docker-compose logs frontend

# Verificar archivos dentro del contenedor
docker exec -it claudeweb-frontend ls /usr/share/nginx/html
```

---

## 📁 Estructura del Proyecto

```
claudeweb/
├── backend/
│   ├── server.js           # Servidor Express
│   ├── package.json        # Dependencias backend
│   ├── Dockerfile          # Docker image backend
│   └── .env.example        # Ejemplo de variables de entorno
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx         # Componente principal
│   │   ├── main.jsx        # Entry point
│   │   └── styles.css      # Estilos globales
│   ├── public/             # Assets estáticos
│   ├── index.html          # HTML template
│   ├── package.json        # Dependencias frontend
│   ├── vite.config.js      # Configuración de Vite
│   ├── Dockerfile          # Docker image frontend
│   ├── nginx.conf          # Configuración Nginx
│   └── .env.example        # Ejemplo de variables de entorno
│
├── docker-compose.yml      # Orquestación Docker
├── .gitignore              # Archivos ignorados por Git
├── .dockerignore           # Archivos ignorados por Docker
└── README.md               # Esta documentación
```

---

## 🔄 Actualizaciones

### Actualizar la aplicación

```bash
# 1. Detener servicios
docker-compose down

# 2. Actualizar código
git pull origin main

# 3. Reconstruir y levantar
docker-compose up -d --build

# 4. Verificar
docker-compose ps
docker-compose logs -f
```

---

## 💡 Roadmap / TODOs

- [ ] Autenticación de usuarios (JWT)
- [ ] Historial de conversaciones persistente
- [ ] Soporte para streaming de respuestas
- [ ] Modo oscuro / claro
- [ ] Exportar conversaciones a PDF/Markdown
- [ ] Soporte para attachments (imágenes, archivos)
- [ ] Multi-idioma (i18n)
- [ ] Métricas y analytics
- [ ] Rate limiting por usuario
- [ ] Base de datos opcional para historial

---

## 🤝 Contribuir

Las contribuciones son bienvenidas! Por favor:

1. Fork el proyecto
2. Crea una rama (`git checkout -b feature/nueva-caracteristica`)
3. Commit tus cambios (`git commit -m 'Agregar nueva característica'`)
4. Push a la rama (`git push origin feature/nueva-caracteristica`)
5. Abre un Pull Request

---

## 📄 Licencia

Este proyecto está bajo la licencia MIT. Ver archivo `LICENSE` para más detalles.

---

## 📞 Soporte

- **Issues:** [GitHub Issues](https://github.com/tu-usuario/claudeweb/issues)
- **Documentación Anthropic:** [docs.anthropic.com](https://docs.anthropic.com)
- **Easypanel Docs:** [easypanel.io/docs](https://easypanel.io/docs)

---

## ⭐ Créditos

Desarrollado con ❤️ usando:
- [Claude AI](https://claude.ai) de Anthropic
- [React](https://react.dev)
- [Express](https://expressjs.com)
- [Docker](https://docker.com)
- [Easypanel](https://easypanel.io)

---

**¡Disfruta usando ClaudeWeb! 🚀**
