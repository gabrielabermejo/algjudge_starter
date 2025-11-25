FROM alpine:latest

# Instalar gcc y dependencias
RUN apk add --no-cache gcc g++ musl-dev

WORKDIR /app

# Script que compila y ejecuta
COPY run.sh /app/run.sh
RUN chmod +x /app/run.sh

ENTRYPOINT ["/app/run.sh"]

