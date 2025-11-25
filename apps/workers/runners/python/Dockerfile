FROM python:3-alpine

WORKDIR /app

# Instalar dependencias necesarias (timeout está en coreutils)
RUN apk add --no-cache gcc musl-dev coreutils

# Script que ejecuta el código
COPY run.sh /app/run.sh
RUN chmod +x /app/run.sh

ENTRYPOINT ["/app/run.sh"]

