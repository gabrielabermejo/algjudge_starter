FROM node:18-alpine

# Instalar Docker CLI para ejecutar contenedores
RUN apk add --no-cache docker-cli

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY index.js ./

CMD ["node", "index.js"]

