# Usa una imagen base de Node.js compatible con la versión requerida (>=18.20.8)
FROM node:18-alpine AS base

# Establece el directorio de trabajo
WORKDIR /app

# Variables de entorno para el build
ENV API_URL=https://api-coffeeshop.core-hub-plex.cloud/wp-json/wp/v2
ENV HOME_URL=https://api-coffeeshop.core-hub-plex.cloud

# Copia los archivos de dependencias
COPY package*.json ./

# Instala todas las dependencias (incluyendo devDependencies para el build)
RUN npm ci

# Copia el código fuente
COPY . .

# Construye la aplicación
RUN npm run build

# Etapa de producción: imagen más ligera
FROM node:18-alpine AS production

# Establece el directorio de trabajo
WORKDIR /app

# Asegura que el servidor escuche en 0.0.0.0
ENV HOST=0.0.0.0
ENV PORT=4321

# Copia las dependencias de producción desde la etapa base
COPY --from=base /app/package*.json ./
COPY --from=base /app/node_modules ./node_modules

# Copia los archivos construidos
COPY --from=base /app/dist ./dist

# Expone el puerto (por defecto 4321 en Astro SSR)
EXPOSE 4321

# Comando para ejecutar la aplicación
CMD ["npm", "start"]
