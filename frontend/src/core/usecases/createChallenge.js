// Caso de uso: crear un reto (solo ADMIN)
export async function createChallenge(challengeRepo, data) {
  return challengeRepo.create(data);
}
