# ============================================
# Stage 1: Builder - Instalar dependencias
# ============================================
FROM node:18-alpine AS builder

WORKDIR /app

# Copiar solo archivos de dependencias primero (aprovecha caché de Docker)
COPY package*.json ./

# Instalar solo dependencias de producción
RUN npm ci --only=production && npm cache clean --force

# ============================================
# Stage 2: Production - Imagen final optimizada
# ============================================
FROM node:18-alpine

WORKDIR /app

# Crear usuario no-root para seguridad
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Copiar node_modules desde el builder
COPY --from=builder --chown=nodejs:nodejs /app/node_modules ./node_modules

# Copiar el resto del código de la aplicación
COPY --chown=nodejs:nodejs . .

# Cambiar al usuario no-root
USER nodejs

# Exponer el puerto (Render puede usar cualquier puerto, pero lo exponemos por defecto)
EXPOSE 8000

# Healthcheck para Render (usa PORT de variables de entorno o 8000 por defecto)
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "const port = process.env.PORT || 8000; require('http').get(`http://localhost:${port}/api/check`, (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Comando para iniciar la aplicación
CMD ["node", "src/index.js"]

