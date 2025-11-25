# Script de PowerShell para probar el sistema AlgJudge
# Ejecuta: .\scripts\probar_sistema.ps1

Write-Host "=== Guía de Pruebas AlgJudge ===" -ForegroundColor Cyan
Write-Host ""

# Paso 1: Verificar servicios
Write-Host "1. Verificando servicios..." -ForegroundColor Yellow
docker compose ps

Write-Host ""
Write-Host "2. Accede a Swagger en: http://localhost:3000/docs" -ForegroundColor Green
Write-Host ""

# Paso 2: Obtener token
Write-Host "3. Obteniendo token de autenticación..." -ForegroundColor Yellow
try {
    $loginBody = @{
        email = "admin@demo.com"
        password = "Admin123!"
    } | ConvertTo-Json

    $loginResponse = Invoke-RestMethod -Uri "http://localhost:3000/auth/login" -Method POST -ContentType "application/json" -Body $loginBody
    $token = $loginResponse.access_token
    Write-Host "✅ Token obtenido: $($token.Substring(0, 20))..." -ForegroundColor Green
    Write-Host ""
} catch {
    Write-Host "❌ Error al obtener token: $_" -ForegroundColor Red
    exit 1
}

# Paso 3: Crear challenge
Write-Host "4. Creando challenge..." -ForegroundColor Yellow
$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

$challengeBody = @{
    title = "Suma de dos números"
    description = "Lee dos números enteros A y B desde la entrada estándar. Imprime la suma A + B."
    difficulty = "easy"
    tags = @("math", "io")
    timeLimit = 2000
    memoryLimit = 128
    state = "published"
} | ConvertTo-Json

try {
    $challenge = Invoke-RestMethod -Uri "http://localhost:3000/challenges" -Method POST -Headers $headers -Body $challengeBody
    $challengeId = $challenge.id
    Write-Host "✅ Challenge creado con ID: $challengeId" -ForegroundColor Green
    Write-Host ""
    
    Write-Host "⚠️  IMPORTANTE: Ahora debes agregar test cases a la BD." -ForegroundColor Yellow
    Write-Host "   Ejecuta este comando reemplazando <CHALLENGE_ID> con: $challengeId" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "   docker compose exec db psql -U algjudge -d algjudge -c \"INSERT INTO test_cases (id, `\"challengeId`\", input, `\"expectedOutput`\", `\"isHidden`\") VALUES (gen_random_uuid(), '$challengeId', '5\n3', '8', false), (gen_random_uuid(), '$challengeId', '10\n20', '30', false);\"" -ForegroundColor Cyan
    Write-Host ""
    
    $agregar = Read-Host "¿Quieres que agregue los test cases automáticamente? (S/N)"
    if ($agregar -eq "S" -or $agregar -eq "s") {
        Write-Host "Agregando test cases..." -ForegroundColor Yellow
        $sql = "INSERT INTO test_cases (id, `"challengeId`", input, `"expectedOutput`", `"isHidden`") VALUES (gen_random_uuid(), '$challengeId', '5\n3', '8', false), (gen_random_uuid(), '$challengeId', '10\n20', '30', false), (gen_random_uuid(), '$challengeId', '100\n200', '300', false);"
        docker compose exec -T db psql -U algjudge -d algjudge -c $sql
        Write-Host "✅ Test cases agregados" -ForegroundColor Green
    }
    
} catch {
    Write-Host "❌ Error al crear challenge: $_" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "5. Enviando submission de prueba..." -ForegroundColor Yellow

# Paso 4: Enviar submission
$submissionBody = @{
    challengeId = $challengeId
    language = "python"
    code = "a = int(input())`nb = int(input())`nprint(a + b)"
} | ConvertTo-Json

try {
    $submission = Invoke-RestMethod -Uri "http://localhost:3000/submissions" -Method POST -Headers $headers -Body $submissionBody
    $submissionId = $submission.id
    Write-Host "✅ Submission creada con ID: $submissionId" -ForegroundColor Green
    Write-Host "   Status inicial: $($submission.status)" -ForegroundColor Cyan
    Write-Host ""
    
    Write-Host "6. Esperando procesamiento (10 segundos)..." -ForegroundColor Yellow
    Start-Sleep -Seconds 10
    
    # Consultar resultado
    Write-Host "7. Consultando resultado..." -ForegroundColor Yellow
    $result = Invoke-RestMethod -Uri "http://localhost:3000/submissions/$submissionId" -Method GET -Headers $headers
    Write-Host ""
    Write-Host "=== RESULTADO ===" -ForegroundColor Cyan
    Write-Host "Status: $($result.status)" -ForegroundColor $(if ($result.status -eq "ACCEPTED") { "Green" } else { "Yellow" })
    Write-Host "Score: $($result.score)" -ForegroundColor Cyan
    Write-Host "Tiempo: $($result.timeMsTotal) ms" -ForegroundColor Cyan
    if ($result.caseResults) {
        Write-Host "Casos de prueba:" -ForegroundColor Cyan
        $result.caseResults | ForEach-Object {
            Write-Host "  - Caso $($_.caseId): $($_.status) ($($_.timeMs) ms)" -ForegroundColor $(if ($_.status -eq "OK") { "Green" } else { "Yellow" })
        }
    }
    Write-Host ""
    
} catch {
    Write-Host "❌ Error al enviar submission: $_" -ForegroundColor Red
}

# Paso 5: Ver métricas
Write-Host "8. Consultando métricas..." -ForegroundColor Yellow
try {
    $metrics = Invoke-RestMethod -Uri "http://localhost:3000/metrics" -Method GET
    Write-Host ""
    Write-Host "=== MÉTRICAS ===" -ForegroundColor Cyan
    Write-Host "Total submissions: $($metrics.submissions_total)" -ForegroundColor Cyan
    Write-Host "Fallidos: $($metrics.submissions_failed_total)" -ForegroundColor Cyan
    Write-Host "Tiempo promedio: $($metrics.average_execution_time_ms) ms" -ForegroundColor Cyan
    Write-Host ""
} catch {
    Write-Host "❌ Error al consultar métricas: $_" -ForegroundColor Red
}

Write-Host "=== Prueba completada ===" -ForegroundColor Green
Write-Host ""
Write-Host "Para ver más detalles:" -ForegroundColor Yellow
Write-Host "  - Swagger: http://localhost:3000/docs" -ForegroundColor Cyan
Write-Host "  - Logs API: docker compose logs api -f" -ForegroundColor Cyan
Write-Host "  - Logs Worker: docker compose logs worker_python -f" -ForegroundColor Cyan

