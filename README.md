
# AlgJudge - Plataforma para Evaluar Algoritmos

## Semana 5 - Implementación Completa

Este proyecto implementa una plataforma backend para evaluar algoritmos (similar a HackerRank, LeetCode) con las siguientes funcionalidades:

### ✅ Funcionalidades Implementadas

#### 1. Base de Datos (TypeORM + PostgreSQL)
- ✅ Entidades: User, Challenge, Submission, TestCase
- ✅ Repositorios con relaciones
- ✅ Migraciones automáticas (synchronize en desarrollo)

#### 2. Runners Efímeros por Lenguaje
- ✅ Python (`algjudge-runner-python`)
- ✅ Node.js (`algjudge-runner-node`)
- ✅ C++ (`algjudge-runner-cpp`)
- ✅ Java (`algjudge-runner-java`)

Cada runner se ejecuta en un contenedor aislado con:
- `--network none` (sin acceso a internet)
- `--cpus 0.5` (límite de CPU)
- `--memory 512m` (límite de memoria)
- `--read-only` (solo lectura)
- `--rm` (se destruye al terminar)

#### 3. Workers por Lenguaje
- ✅ `worker_python` - Procesa submissions de Python
- ✅ `worker_node` - Procesa submissions de Node.js
- ✅ `worker_cpp` - Procesa submissions de C++
- ✅ `worker_java` - Procesa submissions de Java

Cada worker:
- Escucha la cola de Redis
- Ejecuta runners con `docker run`
- Actualiza estados de submissions
- Guarda resultados en la base de datos

#### 4. Sistema de Submissions
- ✅ `POST /submissions` - Envía código para evaluación
- ✅ `GET /submissions/:id` - Consulta estado de submission
- ✅ Estados: QUEUED, RUNNING, ACCEPTED, WRONG_ANSWER, TIME_LIMIT_EXCEEDED, RUNTIME_ERROR, COMPILATION_ERROR
- ✅ Guardado de resultados por caso de prueba
- ✅ Cálculo de score (0-100)

#### 5. Leaderboard
- ✅ `GET /leaderboard/challenge/:challengeId` - Ranking por reto
- ✅ Ordenamiento por score y tiempo
- ✅ Mejor submission por usuario

#### 6. Observabilidad
- ✅ Logs estructurados en JSON con `requestId` y `submissionId`
- ✅ `GET /metrics` - Métricas del sistema:
  - `submissions_total`
  - `submissions_failed_total`
  - `average_execution_time_ms`
  - `submissions_by_status`

#### 7. Docker Compose
- ✅ Servicios: db, redis, api
- ✅ Runners: runner_python, runner_node, runner_cpp, runner_java
- ✅ Workers: worker_python, worker_node, worker_cpp, worker_java
- ✅ Escalado con `docker compose up --scale worker_python=3`

## Instalación y Uso

### Prerrequisitos
- Node.js 18+
- Docker Desktop
- Docker Compose

### Pasos

1. **Configurar variables de entorno:**
   ```bash
   cp .env.example .env
   # Edita .env con tus valores si es necesario
   ```

2. **Construir imágenes de runners:**
   ```bash
   docker compose build runner_python runner_node runner_cpp runner_java
   ```

3. **Levantar servicios:**
   ```bash
   # Infraestructura (DB y Redis)
   docker compose up -d db redis
   
   # Esperar a que la BD esté lista
   sleep 5
   
   # API y Workers
   docker compose up --build -d api worker_python worker_node worker_cpp worker_java
   ```

4. **Verificar servicios:**
   ```bash
   docker compose ps
   ```

5. **Ver logs:**
   ```bash
   docker compose logs -f api
   docker compose logs -f worker_python
   ```

6. **Acceder a Swagger:**
   - Abre http://localhost:3000/docs en tu navegador

## Dockerfile sugerido para `apps/api`
Crea `apps/api/Dockerfile` con:
```Dockerfile
FROM node:18-alpine
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
ENV PORT=3000
EXPOSE 3000
CMD ["node", "dist/main.js"]
```

## API Endpoints

### Autenticación
- `POST /auth/login` - Iniciar sesión (obtener JWT)

### Challenges
- `GET /challenges` - Listar retos (query: `?state=published`)
- `GET /challenges/:id` - Obtener reto por ID
- `POST /challenges` - Crear reto (ADMIN)
- `PUT /challenges/:id` - Actualizar reto (ADMIN)
- `DELETE /challenges/:id` - Eliminar reto (ADMIN)

### Submissions
- `POST /submissions` - Enviar código para evaluación
  ```json
  {
    "challengeId": "uuid",
    "language": "python|node|cpp|java",
    "code": "print('Hello World')"
  }
  ```
- `GET /submissions/:id` - Consultar estado de submission

### Leaderboard
- `GET /leaderboard/challenge/:challengeId` - Ranking por reto
- `GET /leaderboard/user/:userId` - Submissions por usuario

### Métricas
- `GET /metrics` - Métricas del sistema

## Ejemplo de Uso

1. **Iniciar sesión:**
   ```bash
   curl -X POST http://localhost:3000/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"admin@demo.com","password":"Admin123!"}'
   ```

2. **Crear un reto (ADMIN):**
   ```bash
   curl -X POST http://localhost:3000/challenges \
     -H "Authorization: Bearer <TOKEN>" \
     -H "Content-Type: application/json" \
     -d '{
       "title": "Suma de dos números",
       "description": "Lee A y B, imprime A+B",
       "difficulty": "easy",
       "tags": ["math", "io"],
       "timeLimit": 1000,
       "memoryLimit": 128,
       "state": "published"
     }'
   ```

3. **Enviar solución:**
   ```bash
   curl -X POST http://localhost:3000/submissions \
     -H "Authorization: Bearer <TOKEN>" \
     -H "Content-Type: application/json" \
     -d '{
       "challengeId": "<CHALLENGE_ID>",
       "language": "python",
       "code": "a = int(input())\nb = int(input())\nprint(a + b)"
     }'
   ```

4. **Consultar resultado:**
   ```bash
   curl http://localhost:3000/submissions/<SUBMISSION_ID> \
     -H "Authorization: Bearer <TOKEN>"
   ```

## Escalado de Workers

Puedes escalar los workers según la carga:

```bash
docker compose up --scale worker_python=3 --scale worker_node=2 -d
```

## Estructura del Proyecto

```
apps/
├── api/                    # API NestJS
│   └── src/
│       ├── domain/         # Entidades de dominio
│       ├── challenges/     # Módulo de retos
│       ├── submissions/    # Módulo de submissions
│       ├── leaderboard/    # Módulo de leaderboard
│       ├── metrics/         # Módulo de métricas
│       └── infrastructure/ # Configuración de BD
└── workers/
    ├── runners/            # Imágenes Docker para ejecutar código
    │   ├── python/
    │   ├── node/
    │   ├── cpp/
    │   └── java/
    └── worker_*/           # Workers que procesan jobs
```

## Notas Importantes

- Los runners se ejecutan en contenedores completamente aislados
- Cada submission pasa por estados: QUEUED → RUNNING → (ACCEPTED|ERROR)
- Los logs están en formato JSON para facilitar el análisis
- Las métricas se actualizan en tiempo real
- El leaderboard muestra el mejor resultado por usuario por reto


> Actualizado 2025

