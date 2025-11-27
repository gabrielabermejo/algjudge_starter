import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { loginUser } from "../../core/usecases/loginUser";
import { AuthRepositoryImpl } from "../../data/repositories/AuthRepositoryImpl";

const authRepo = new AuthRepositoryImpl();

export default function LoginPage() {
  const nav = useNavigate();

  const [email, setEmail] = useState("admin@demo.com");
  const [password, setPassword] = useState("Admin123!");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    console.log("➡️ handleSubmit llamado", { email, password });
    setError("");
    setLoading(true);

    try {
      const user = await loginUser(authRepo, email, password);
      console.log("✅ Login OK, user:", user);
      nav("/challenges");
    } catch (err) {
      console.error("❌ Error en login:", err);
      setError(err.message || "Credenciales inválidas");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        width: "100%",
        minHeight: "calc(100vh - 80px)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          width: "350px",
          padding: "30px",
          borderRadius: "8px",
          background: "#ffffff",
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
          Iniciar Sesión
        </h2>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Correo"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              marginBottom: "15px",
              border: "1px solid #ccc",
              borderRadius: "5px",
            }}
          />

          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              marginBottom: "15px",
              border: "1px solid #ccc",
              borderRadius: "5px",
            }}
          />

          {error && (
            <p style={{ color: "red", marginBottom: "10px" }}>{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "10px",
              background: loading ? "#888" : "#4e5af7",
              border: "none",
              color: "white",
              borderRadius: "5px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}
