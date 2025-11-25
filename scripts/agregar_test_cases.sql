-- Script para agregar test cases a un challenge
-- Uso: docker compose exec -T db psql -U algjudge -d algjudge < scripts/agregar_test_cases.sql
-- O reemplaza <CHALLENGE_ID> con el ID real y ejecuta en psql

-- Ejemplo: Agregar test cases para el challenge de suma
-- Reemplaza '<CHALLENGE_ID>' con el ID real de tu challenge

INSERT INTO test_cases (id, "challengeId", input, "expectedOutput", "isHidden")
VALUES 
  (gen_random_uuid(), '<CHALLENGE_ID>', '5\n3', '8', false),
  (gen_random_uuid(), '<CHALLENGE_ID>', '10\n20', '30', false),
  (gen_random_uuid(), '<CHALLENGE_ID>', '100\n200', '300', false),
  (gen_random_uuid(), '<CHALLENGE_ID>', '0\n0', '0', false),
  (gen_random_uuid(), '<CHALLENGE_ID>', '-5\n5', '0', false);

-- Verificar que se insertaron
SELECT id, "challengeId", input, "expectedOutput", "isHidden" 
FROM test_cases 
WHERE "challengeId" = '<CHALLENGE_ID>';

