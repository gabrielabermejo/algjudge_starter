#!/bin/sh
set -e

# Leer casos de prueba desde argumentos
INPUT_FILE=$1
EXPECTED_OUTPUT_FILE=$2
TIME_LIMIT_MS=$3
MEMORY_LIMIT_MB=$4

# El código ya está en /data/code.py (montado por el worker)

# Ejecutar con timeout
timeout=$(($TIME_LIMIT_MS / 1000))
if [ $timeout -lt 1 ]; then
  timeout=1
fi

# Ejecutar código (usar /data en lugar de /tmp porque /tmp es read-only)
timeout ${timeout}s python3 /data/code.py < "$INPUT_FILE" > /data/output.txt 2> /data/error.txt
EXIT_CODE=$?

# Verificar timeout
if [ $EXIT_CODE -eq 124 ]; then
  echo "TIME_LIMIT_EXCEEDED"
  exit 1
fi

# Verificar errores
if [ $EXIT_CODE -ne 0 ]; then
  echo "RUNTIME_ERROR"
  cat /data/error.txt 2>/dev/null || echo "Error code: $EXIT_CODE"
  exit 1
fi

# Comparar salida (ignorar espacios en blanco al final)
if diff -q -w /data/output.txt "$EXPECTED_OUTPUT_FILE" > /dev/null 2>&1; then
  echo "ACCEPTED"
else
  echo "WRONG_ANSWER"
  exit 1
fi

