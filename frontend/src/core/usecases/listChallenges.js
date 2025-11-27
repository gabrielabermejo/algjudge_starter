// Caso de uso: listar retos disponibles
export async function listChallenges(challengeRepo) {
  return challengeRepo.list();
}
