# ============================================
# STAGE 1: Build (opcional para futuras mejoras)
# ============================================
# En este caso no necesitamos build stage porque
# es HTML/CSS/JS puro, pero lo dejamos preparado
FROM node:18-alpine AS builder

WORKDIR /build

# Copiar archivos del proyecto
COPY package*.json ./
COPY . .

# ============================================
# STAGE 2: Production
# ============================================
FROM nginx:alpine

# Metadata
LABEL maintainer="Disney100 x Britto Catalog"
LABEL version="1.0.0"
LABEL description="Static web catalog with Disney 100 + Romero Britto style"

# Variables de entorno
ENV NGINX_HOST=localhost
ENV NGINX_PORT=80

# Copiar archivos estáticos al directorio de nginx
COPY . /usr/share/nginx/html/

# Copiar configuración personalizada de nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exponer puerto 80
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:80/ || exit 1

# Comando por defecto
CMD ["nginx", "-g", "daemon off;"]
