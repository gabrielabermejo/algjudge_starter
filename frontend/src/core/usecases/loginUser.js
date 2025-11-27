export async function loginUser(authRepo, email, password) {
  // Simplemente delega en el repositorio
  return authRepo.login(email, password);
}