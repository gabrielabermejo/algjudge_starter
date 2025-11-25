# Script para insertar test cases
# Uso: .\scripts\insert_test_cases.ps1 -ChallengeId "tu-challenge-id"

param(
    [Parameter(Mandatory=$true)]
    [string]$ChallengeId
)

Write-Host "Insertando test cases para challenge: $ChallengeId" -ForegroundColor Yellow

# Leer el archivo SQL y reemplazar el placeholder
$sqlContent = Get-Content scripts\test_cases.sql -Raw
$sqlContent = $sqlContent -replace '<CHALLENGE_ID>', $ChallengeId

try {
    # Ejecutar SQL
    $sqlContent | docker compose exec -T db psql -U algjudge -d algjudge
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Test cases insertados correctamente" -ForegroundColor Green
        
        # Verificar
        Write-Host "`nVerificando test cases insertados:" -ForegroundColor Cyan
        $verifySql = "SELECT id, `"challengeId`", input, `"expectedOutput`", `"isHidden`" FROM test_cases WHERE `"challengeId`" = '$ChallengeId';"
        docker compose exec -T db psql -U algjudge -d algjudge -c $verifySql
    } else {
        Write-Host "❌ Error al insertar test cases" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Error al insertar test cases: $_" -ForegroundColor Red
}

