import { httpPost } from "../sources/httpClient";
import { getToken } from "./AuthRepositoryImpl";

const API_URL = "http://localhost:3000";

export class SubmissionsRepositoryImpl {
  async submit({ challengeId, language }) {
    const token = getToken();
    if (!token) {
      throw new Error("No autenticado");
    }

    const body = {
      challengeId,
      language, 
    };

    return await httpPost(
      `${API_URL}/submissions`,
      body,
      { Authorization: `Bearer ${token}` }
    );
  }
}
