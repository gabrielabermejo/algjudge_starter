import { httpGet, httpPost } from "../sources/httpClient";
import { Challenge } from "../../core/domain/Challenge";
import { getToken } from "./AuthRepositoryImpl";

const API_URL = "http://localhost:3000";

export class ChallengeRepositoryImpl {
  async list() {
    const data = await httpGet(`${API_URL}/challenges`);
    return data.map((c) => new Challenge(c));
  }

  async getById(id) {
    const data = await httpGet(`${API_URL}/challenges/${id}`);
    return new Challenge(data);
  }

  async create(dto) {
    const token = getToken();
    if (!token) {
      throw new Error("No autenticado");
    }

    const data = await httpPost(
      `${API_URL}/challenges`,
      dto,
      { Authorization: `Bearer ${token}` }
    );

    // el endpoint devuelve el reto creado
    return new Challenge(data);
  }
}
