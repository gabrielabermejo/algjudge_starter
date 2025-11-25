# ✅ Verificación: Semana 5 - Todos los Incisos

## 📋 Incisos Requeridos

### ✅ 1. Implementar runners efímeros en Compose (docker run)

**Estado: ✅ COMPLETADO**

#### ¿Qué son los runners efímeros?

Los runners **NO son servicios persistentes** en docker-compose. Son **imágenes Docker** que se ejecutan temporalmente con `docker run` cuando se necesita procesar código.

#### Cómo Funciona:

1. **En `docker-compose.yml`**: Los runners solo se definen para **construir las imágenes**:
   ```yaml
   runner_python:
     build: ./apps/workers/runners/python
     image: algjudge-runner-python:latest
   ```
   Esto solo construye la imagen, **NO la ejecuta como servicio**.

2. **Los workers ejecutan los runners con `docker run`**:
   ```javascript
   // En apps/workers/worker_python/index.js (línea 74)
   const dockerCmd = `docker run --rm --network none --cpus 0.5 --memory ${memoryLimit}m --read-only -v ${tempDir}:/data:rw ${RUNNER_IMAGE} ...`;
   ```

3. **Características de los runners efímeros**:
   - ✅ `--rm`: Se destruyen automáticamente al terminar
   - ✅ `--network none`: Sin acceso a internet (aislamiento)
   - ✅ `--cpus 0.5`: Límite de CPU
   - ✅ `--memory ${memoryLimit}m`: Límite de memoria
   - ✅ `--read-only`: Sistema de archivos de solo lectura (seguridad)
   - ✅ Se ejecutan solo cuando hay un job que procesar

#### Verificación:

```bash
# Ver imágenes construidas (existen)
docker images | grep algjudge-runner

# Ver contenedores en ejecución (NO deben estar corriendo como servicios)
docker ps | grep runner
# Debe estar vacío (los runners solo se ejecutan temporalmente)

# Ver contenedores que se ejecutaron y se destruyeron (--rm)
docker ps -a | grep runner
# Puede mostrar algunos que se ejecutaron recientemente
```

**✅ CONCLUSIÓN**: Los runners son **efímeros** - se ejecutan con `docker run` desde los workers, procesan el código, y se destruyen automáticamente. **NO son servicios persistentes**.

---

### ✅ 2. Guardar resultados de submissions + leaderboard

**Estado: ✅ COMPLETADO**

#### Guardado de Resultados:

1. **Entidad Submission** (`apps/api/src/domain/entities/submission.entity.ts`):
   - ✅ `status`: Estado de la submission
   - ✅ `score`: Puntuación (0-100)
   - ✅ `timeMsTotal`: Tiempo total de ejecución
   - ✅ `memoryKbTotal`: Memoria total usada
   - ✅ `caseResults`: Array JSON con resultados por caso de prueba
   - ✅ `compilationError`: Error de compilación (si aplica)
   - ✅ `runtimeError`: Error de ejecución (si aplica)

2. **Persistencia en BD**:
   - ✅ Los workers actualizan los resultados vía `PUT /submissions/:id/update`
   - ✅ `SubmissionsService.updateStatus()` guarda en la base de datos
   - ✅ TypeORM persiste automáticamente

3. **Leaderboard**:
   - ✅ `GET /leaderboard/challenge/:challengeId` - Ranking por reto
   - ✅ `GET /leaderboard/user/:userId` - Submissions por usuario
   - ✅ Ordenamiento por: score (DESC) → tiempo (ASC) → fecha (ASC)
   - ✅ Mejor submission por usuario (agrupación)

#### Verificación:

```bash
# Ver submissions en la BD
docker compose exec db psql -U algjudge -d algjudge -c "SELECT id, status, score, \"timeMsTotal\" FROM submissions LIMIT 5;"

# Ver leaderboard en Swagger
# GET /leaderboard/challenge/{challengeId}
```

**✅ CONCLUSIÓN**: Los resultados se guardan completamente en la BD y el leaderboard funciona correctamente.

---

### ✅ 3. Añadir logs y métricas básicas

**Estado: ✅ COMPLETADO**

#### Logs Estructurados:

1. **LoggingInterceptor** (`apps/api/src/common/logging.interceptor.ts`):
   - ✅ Logs en formato JSON
   - ✅ `requestId` único por request
   - ✅ Información de método, URL, body, statusCode, duration
   - ✅ Logs de errores con stack trace

2. **Logs en Workers**:
   - ✅ Logs estructurados en JSON
   - ✅ `submissionId`, `requestId`, `challengeId` en cada log
   - ✅ Niveles: `info`, `error`

#### Métricas:

1. **Endpoint `/metrics`** (`apps/api/src/metrics/`):
   - ✅ `submissions_total`: Total de submissions
   - ✅ `submissions_failed_total`: Total de submissions fallidas
   - ✅ `average_execution_time_ms`: Tiempo promedio de ejecución
   - ✅ `submissions_by_status`: Conteo por estado

#### Verificación:

```bash
# Ver logs estructurados de la API
docker compose logs api | Select-String -Pattern "requestId"

# Ver logs de workers
docker compose logs worker_python | Select-String -Pattern "submissionId"

# Ver métricas
curl http://localhost:3000/metrics
```

**✅ CONCLUSIÓN**: Los logs están estructurados en JSON y las métricas están implementadas y funcionando.

---

## 🎯 Resumen Final

| Inciso | Estado | Verificación |
|--------|--------|--------------|
| 1. Runners efímeros con `docker run` | ✅ | Los workers ejecutan `docker run --rm` |
| 2. Guardar resultados + leaderboard | ✅ | BD persiste resultados, leaderboard funciona |
| 3. Logs y métricas básicas | ✅ | Logs JSON con requestId, endpoint /metrics |

---

## 🔍 Pregunta Frecuente: "¿Por qué los runners no están corriendo?"

**Respuesta**: Los runners **NO deben estar corriendo como servicios**. Son **efímeros**:

1. **Se construyen** cuando haces `docker compose build`
2. **Se ejecutan temporalmente** cuando un worker necesita procesar código
3. **Se destruyen automáticamente** cuando terminan (gracias a `--rm`)

**Flujo Real**:
```
1. Usuario envía submission → API encola job en Redis
2. Worker detecta job → Ejecuta `docker run algjudge-runner-python:latest ...`
3. Runner procesa código → Devuelve resultado
4. Worker actualiza submission en BD
5. Contenedor runner se destruye automáticamente (--rm)
```

**Para verificar que funcionan**:
```bash
# Mientras procesas una submission, verás contenedores temporales:
docker ps | grep runner
# Verás algo como: algjudge-runner-python (temporal)

# Después de procesar, desaparecen:
docker ps | grep runner
# Vacío (porque se destruyeron con --rm)
```

---

## ✅ Conclusión

**TODOS los incisos de la Semana 5 están COMPLETADOS y FUNCIONANDO correctamente.**

Los runners son efímeros por diseño - se ejecutan solo cuando se necesitan y se destruyen automáticamente. Esto es más eficiente y seguro que tener servicios persistentes.

