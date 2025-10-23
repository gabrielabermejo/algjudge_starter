
# AlgJudge Starter (Primera Entrega)

- Clean Architecture básica (carpetas sugeridas).
- `docker-compose.yml` con **Postgres** y **Redis** listos.
- Esqueleto de **worker_stub** con Bull (cola en Redis).
- `src/main.ts` con **Swagger** habilitado.
- `.env.example` con variables mínimas.

## Pasos instalación
1) Instala Node 18+ y Docker Desktop.
2) Crea el proyecto Nest en `apps/api`:
   ```bash
   cd apps/api
   npx @nestjs/cli new . --package-manager npm
   ```
   Si te pide sobreescribir, elige **Yes** (este starter no trae los archivos Nest por defecto).
3) Instala dependencias en `apps/api`:
   ```bash
   npm i @nestjs/config @nestjs/jwt passport passport-jwt bcrypt
   npm i @nestjs/typeorm typeorm pg
   npm i @nestjs/swagger swagger-ui-express
   npm i ioredis @nestjs/bull bull
   npm i class-validator class-transformer
   ```
4) Copia el `src/main.ts` de este starter y reemplaza el generado por Nest.
5) Crea módulos `auth`, `users`, `challenges`, `submissions`, `queue` y `health`.
6) Ajusta el `Dockerfile` dentro de `apps/api` (ver ejemplo abajo).
7) En la raíz, copia `.env.example` a `.env` y ajusta los valores.
8) Levanta infraestructura y prueba:
   ```bash
   docker compose up -d db redis
   # Luego, desde apps/api crea tu imagen y sube api y worker
   docker compose up --build -d api worker_stub
   docker compose ps
   ```

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

## Rutas mínimas a preparar para la entrega
- `POST /auth/login` (JWT)
- `GET /challenges` (paginado, filtro por estado)
- `POST /challenges` (ADMIN)
- `PUT /challenges/:id` (ADMIN)
- `DELETE /challenges/:id` (ADMIN)
- `POST /submissions` → **encola** un job en Redis (estado inicial `QUEUED`)
- `GET /submissions/:id` → estado actual

## Prueba rápida de la cola (una vez arriba el `worker_stub`)
```bash
curl -X POST http://localhost:3000/submissions \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"challengeId":"c1","language":"python"}'
```

## Observabilidad
- Logs en JSON por request y por `submissionId`.
- Endpoint `/metrics` (puede devolver contadores simples por ahora).
- Swagger en `/docs`.

¡Éxitos! Ajusta y amplía según el enunciado.

> Actualizado desde Windows – 22/10/2025

