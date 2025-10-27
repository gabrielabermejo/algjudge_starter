#!/usr/bin/env bash
set -euo pipefail

# Login ADMIN
ADMIN_TOKEN=$(curl -s -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@demo.com","password":"Admin123!"}' | \
  python3 -c 'import sys,json; print(json.load(sys.stdin).get("access_token",""))')

echo "Admin token: ${ADMIN_TOKEN:0:25}..."

# Crear challenge
CREATE=$(curl -s -X POST http://localhost:3000/challenges \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Suma","description":"Lee A y B, imprime A+B","difficulty":"easy","tags":["math","io"],"timeLimit":1000,"memoryLimit":128,"state":"published"}')
echo "Create challenge: $CREATE"

# Extraer ID del challenge creado (método 1: leer del JSON devuelto)
CH_ID=$(echo "$CREATE" | python3 -c 'import sys,json; import sys; data=sys.stdin.read().strip(); import json; print(json.loads(data).get("id","")) if data else print("")' 2>/dev/null || true)

# Si no salió, método 2: tomar el último challenge de la lista
if [ -z "${CH_ID:-}" ]; then
  CH_ID=$(curl -s http://localhost:3000/challenges | python3 - <<'PY'
import sys,json
try:
    d=json.load(sys.stdin) or []
    print(d[-1]["id"] if d else "")
except Exception:
    print("")
PY
)
fi

echo "CH_ID=$CH_ID"

# Login STUDENT
STU_TOKEN=$(curl -s -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"student@demo.com","password":"Student123!"}' | \
  python3 -c 'import sys,json; print(json.load(sys.stdin).get("access_token",""))')

echo "Student token: ${STU_TOKEN:0:25}..."

# Enviar submission
SUB=$(curl -s -X POST http://localhost:3000/submissions \
  -H "Authorization: Bearer $STU_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"challengeId\":\"$CH_ID\",\"language\":\"python\"}")
echo "Submission: $SUB"
