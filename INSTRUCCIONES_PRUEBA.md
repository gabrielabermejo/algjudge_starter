# 🚀 Instrucciones Rápidas para Probar AlgJudge

## ✅ Verificación Inicial (1 minuto)

```bash
# 1. Verificar que todos los servicios estén corriendo
docker compose ps

# Debes ver todos los servicios en estado "Up" o "Running"
```

Si algún servicio no está corriendo:
```bash
docker compose up -d
```

---

## 🎯 Método Rápido: Script Automatizado (Recomendado)

```powershell
# Ejecuta el script de prueba automatizado
.\scripts\probar_sistema.ps1
```

Este script:
- ✅ Verifica servicios
- ✅ Obtiene token de autenticación
- ✅ Crea un challenge
- ✅ Agrega test cases
- ✅ Envía una submission
- ✅ Consulta el resultado
- ✅ Muestra métricas

---

## 📖 Método Manual: Paso a Paso

### Paso 1: Abrir Swagger
Abre tu navegador en: **http://localhost:3000/docs**

### Paso 2: Iniciar Sesión
1. Busca `POST /auth/login`
2. Usa estas credenciales:
   ```json
   {
     "email": "admin@demo.com",
     "password": "Admin123!"
   }
   ```
3. Copia el `access_token`

### Paso 3: Crear un Challenge
1. Busca `POST /challenges`
2. Haz clic en el candado 🔒 y pega: `Bearer <tu_token>`
3. Usa este JSON:
   ```json
   {
     "title": "Suma de dos números",
     "description": "Lee dos números A y B, imprime A+B",
     "difficulty": "easy",
     "tags": ["math", "io"],
     "timeLimit": 2000,
     "memoryLimit": 128,
     "state": "published"
   }
   ```
4. Copia el `id` del challenge

### Paso 4: Agregar Test Cases

**Opción A: Usando el script (Recomendado)**
```powershell
.\scripts\insert_test_cases.ps1 -ChallengeId "tu-challenge-id"
```

**Opción B: Usando el archivo SQL**
```powershell
# Reemplaza "tu-challenge-id-aqui" con el ID real (SIN los símbolos < >)
$challengeId = "6e7eae96-0f9b-433c-8db9-4fcbdb31fa7a"
$sqlContent = Get-Content scripts\test_cases.sql -Raw
$sqlContent = $sqlContent -replace '6e7eae96-0f9b-433c-8db9-4fcbdb31fa7a', $challengeId
$sqlContent | docker compose exec -T db psql -U algjudge -d algjudge
```

**Ejemplo con ID real:**
```powershell
$challengeId = "4f980575-1eb7-44ac-b786-015e8e5bbe3c"  # ← Solo el ID, sin < >
$sqlContent = Get-Content scripts\test_cases.sql -Raw
$sqlContent = $sqlContent -replace '<CHALLENGE_ID>', $challengeId
$sqlContent | docker compose exec -T db psql -U algjudge -d algjudge
```

**Opción C: Directo en psql**
```bash
docker compose exec db psql -U algjudge -d algjudge
```
Luego ejecuta (reemplaza `<CHALLENGE_ID>`):
```sql
INSERT INTO test_cases (id, "challengeId", input, "expectedOutput", "isHidden")
VALUES 
  (gen_random_uuid(), '<CHALLENGE_ID>', E'5\n3', '8', false),
  (gen_random_uuid(), '<CHALLENGE_ID>', E'10\n20', '30', false),
  (gen_random_uuid(), '<CHALLENGE_ID>', E'100\n200', '300', false);
```

### Paso 5: Enviar una Submission
1. Busca `POST /submissions`
2. Autentica con tu token
3. Usa este JSON (reemplaza `<CHALLENGE_ID>`):
   ```json
   {
     "challengeId": "<CHALLENGE_ID>",
     "language": "python",
     "code": "a = int(input())\nb = int(input())\nprint(a + b)"
   }
   ```
4. Copia el `id` de la submission

### Paso 6: Ver Resultado
1. Espera 5-10 segundos
2. Busca `GET /submissions/{id}`
3. Pega el ID de la submission
4. Debes ver el resultado con `status`, `score`, y `caseResults`

---

## 🔍 Cómo Saber si Está Funcionando Bien

### ✅ Señales de que TODO funciona:

1. **Servicios corriendo:**
   ```bash
   docker compose ps
   # Todos deben estar "Up" o "Running"
   ```

2. **Swagger accesible:**
   - Abre http://localhost:3000/docs
   - Debes ver todos los endpoints listados

3. **Login funciona:**
   - Obtienes un token JWT válido
   - El token tiene formato largo (ej: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`)

4. **Challenge creado:**
   - Recibes un objeto con `id`, `title`, `description`, etc.
   - El ID es un UUID (ej: `f05fdd0f-9711-9228-6120-c...`)

5. **Submission procesada:**
   ```bash
   # Ver logs del worker
   docker compose logs worker_python -f
   ```
   - Debes ver: `Processing submission`
   - Luego: `Submission completed` con status `ACCEPTED`

6. **Resultado correcto:**
   - Status: `ACCEPTED` (código correcto) o `WRONG_ANSWER` (código incorrecto)
   - Score: 0-100
   - `caseResults`: array con resultados por caso

7. **Métricas funcionando:**
   - `GET /metrics` devuelve números reales
   - `submissions_total` aumenta con cada submission

---

## 🐛 Problemas Comunes y Soluciones

### ❌ "Connection refused" al acceder a Swagger
**Solución:**
```bash
docker compose logs api
# Si hay errores, reconstruir:
docker compose build api
docker compose up -d api
```

### ❌ Worker no procesa jobs
**Solución:**
```bash
# Ver logs del worker
docker compose logs worker_python

# Verificar Redis
docker compose exec redis redis-cli ping
# Debe responder: PONG

# Verificar que el worker esté escuchando
docker compose logs worker_python | Select-String "Listening"
# Debe mostrar: "Listening on queue"
```

### ❌ "Challenge not found" al enviar submission
**Solución:**
- Verifica que el challenge ID sea correcto
- Verifica que el challenge esté en estado "published"
- Consulta: `GET /challenges` para ver todos los challenges

### ❌ Submission queda en "QUEUED" y no se procesa
**Solución:**
```bash
# Verificar que el worker esté corriendo
docker compose ps worker_python

# Ver logs en tiempo real
docker compose logs worker_python -f

# Si el worker no está corriendo:
docker compose up -d worker_python
```

### ❌ Error "crypto is not defined"
**Solución:**
```bash
# Reconstruir la API (ya está corregido)
docker compose build api
docker compose up -d api
```

---

## 📊 Verificación Completa - Checklist

Marca cada punto cuando lo completes:

- [ ] ✅ Todos los servicios están corriendo (`docker compose ps`)
- [ ] ✅ Swagger accesible en http://localhost:3000/docs
- [ ] ✅ Puedo iniciar sesión y obtener token
- [ ] ✅ Puedo crear un challenge
- [ ] ✅ Puedo agregar test cases a la BD
- [ ] ✅ Puedo enviar una submission
- [ ] ✅ El worker procesa el job (veo logs)
- [ ] ✅ Puedo consultar el resultado
- [ ] ✅ El resultado muestra status, score y caseResults
- [ ] ✅ Puedo ver el leaderboard
- [ ] ✅ Puedo ver las métricas
- [ ] ✅ Los logs están en formato JSON estructurado

---

## 🎓 Ejemplos de Código para Probar

### Python (Correcto)
```python
a = int(input())
b = int(input())
print(a + b)
```

### Python (Incorrecto - multiplica en vez de sumar)
```python
a = int(input())
b = int(input())
print(a * b)
```

### Node.js
```javascript
const readline = require('readline');
const rl = readline.createInterface({input: process.stdin});
let lines = [];
rl.on('line', (line) => {lines.push(line);});
rl.on('close', () => {
  const a = parseInt(lines[0]);
  const b = parseInt(lines[1]);
  console.log(a + b);
});
```

### C++
```cpp
#include <iostream>
using namespace std;
int main() {
  int a, b;
  cin >> a >> b;
  cout << a + b << endl;
  return 0;
}
```

### Java
```java
import java.util.Scanner;
public class Main {
  public static void main(String[] args) {
    Scanner sc = new Scanner(System.in);
    int a = sc.nextInt();
    int b = sc.nextInt();
    System.out.println(a + b);
  }
}
```

---

## 📝 Comandos Útiles

```bash
# Ver todos los logs
docker compose logs -f

# Ver logs de un servicio específico
docker compose logs api -f
docker compose logs worker_python -f

# Ver estado de servicios
docker compose ps

# Reiniciar un servicio
docker compose restart api

# Reconstruir y levantar
docker compose up --build -d

# Ver logs de la base de datos
docker compose logs db

# Conectar a la base de datos
docker compose exec db psql -U algjudge -d algjudge

# Ver cola de Redis
docker compose exec redis redis-cli
# Dentro de redis-cli:
KEYS *
LLEN bull:submissions:wait
```

---

## 🎉 ¡Listo!

Sigue estos pasos y verifica cada punto del checklist. Si todo está marcado, ¡tu sistema está funcionando correctamente!

Para más detalles, consulta `GUIA_PRUEBAS.md`

