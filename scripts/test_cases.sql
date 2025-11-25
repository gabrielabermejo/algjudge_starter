-- Script para insertar test cases
-- Reemplaza <CHALLENGE_ID> con el ID real antes de ejecutar

INSERT INTO test_cases (id, "challengeId", input, "expectedOutput", "isHidden")
VALUES 
  (gen_random_uuid(), '6e7eae96-0f9b-433c-8db9-4fcbdb31fa7a', E'5\n3', '8', false),
  (gen_random_uuid(), '6e7eae96-0f9b-433c-8db9-4fcbdb31fa7a', E'10\n20', '30', false),
  (gen_random_uuid(), '6e7eae96-0f9b-433c-8db9-4fcbdb31fa7a', E'100\n200', '300', false);

