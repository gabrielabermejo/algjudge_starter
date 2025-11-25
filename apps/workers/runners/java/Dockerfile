FROM eclipse-temurin:17-jdk-alpine

WORKDIR /app

# Instalar timeout (coreutils)
RUN apk add --no-cache coreutils

# Script que compila y ejecuta
COPY run.sh /app/run.sh
RUN chmod +x /app/run.sh

ENTRYPOINT ["/app/run.sh"]

