FROM node:18-alpine

WORKDIR /app

# Instalar timeout (coreutils)
RUN apk add --no-cache coreutils

# Script que ejecuta el código
COPY run.sh /app/run.sh
RUN chmod +x /app/run.sh

ENTRYPOINT ["/app/run.sh"]

