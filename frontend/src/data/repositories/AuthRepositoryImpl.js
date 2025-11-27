import { httpPost } from "../sources/httpClient";
import { User } from "../../core/domain/User";

const API_URL = "http://localhost:3000";

export class AuthRepositoryImpl {
  async login(email, password) {
    const data = await httpPost(`${API_URL}/auth/login`, {
      email,
      password,
    });

    // El backend devuelve { access_token }
    const token = data.access_token;
    if (!token) {
      throw new Error("Token no recibido desde el backend");
    }

    // Guardar token
    localStorage.setItem("token", token);

    // Decodificar JWT (payload en la segunda parte)
    const payload = JSON.parse(atob(token.split(".")[1]));

    const user = new User({
      email: payload.email,
      role: payload.role,
    });

    // Guardar usuario
    localStorage.setItem("user", JSON.stringify(user));

    return user;
  }
}

// Helpers para usar en otros lados (Navbar, ProtectedRoute, etc.)
export function getCurrentUser() {
  const raw = localStorage.getItem("user");
  return raw ? JSON.parse(raw) : null;
}

export function getToken() {
  return localStorage.getItem("token");
}

export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}