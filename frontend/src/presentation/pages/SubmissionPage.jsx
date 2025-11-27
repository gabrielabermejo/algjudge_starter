import { useState } from "react";
import { useLocation, useNavigate, useParams, Link } from "react-router-dom";
import { SubmissionsRepositoryImpl } from "../../data/repositories/SubmissionsRepositoryImpl";
import { submitSolution } from "../../core/usecases/submitSolution";

const repo = new SubmissionsRepositoryImpl();

export default function SubmissionPage() {
  const { id: challengeId } = useParams();
  const nav = useNavigate();
  const location = useLocation();
  const challengeTitle = location.state?.title || "";

  const [language, setLanguage] = useState("python");
  const [code, setCode] = useState("");        // 👈 solo para la UI
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setResult(null);
    setLoading(true);

    try {
      
      const res = await submitSolution(repo, {
        challengeId,
        language,
      });
      setResult(res);
    } catch (err) {
      console.error("Error enviando submission:", err);
      setError(err.message || "Error al enviar la solución.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <Link
        to={`/challenges/${challengeId}`}
        style={{ display: "inline-block", marginBottom: 10 }}
      >
        ← Volver al reto
      </Link>

      <h2>Enviar solución</h2>
      {challengeTitle && (
        <p>
          <strong>Reto:</strong> {challengeTitle}
        </p>
      )}

      <form onSubmit={handleSubmit} style={{ maxWidth: "800px" }}>
        <div style={{ marginBottom: 12 }}>
          <label>
            Lenguaje:
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              style={{ marginLeft: 8, padding: 4 }}
            >
              <option value="python">Python</option>
              <option value="javascript">JavaScript</option>
              <option value="cpp">C++</option>
            </select>
          </label>
        </div>

        {/* Campo de código solo visual, NO se manda al backend */}
        <div style={{ marginBottom: 12 }}>
          <label style={{ display: "block", marginBottom: 6 }}>
            Código:
          </label>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            rows={10}
            style={{
              width: "100%",
              fontFamily: "monospace",
              padding: 10,
              borderRadius: 6,
              border: "1px solid #ccc",
            }}
            placeholder="Escribe tu solución aquí (no se ejecuta realmente, solo se simula el flujo)..."
          />
        </div>

        {error && (
          <p style={{ color: "red", marginBottom: 10 }}>{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "10px 16px",
            background: loading ? "#888" : "#4e5af7",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          {loading ? "Enviando..." : "Enviar solución"}
        </button>
      </form>

      {result && (
        <div
          style={{
            marginTop: 20,
            padding: 12,
            borderRadius: 6,
            border: "1px solid #ddd",
            background: "#f8f8f8",
            maxWidth: "400px",
          }}
        >
          <p>
            <strong>Submission ID:</strong> {result.submissionId}
          </p>
          <p>
            <strong>Estado:</strong> {result.status}
          </p>
        </div>
      )}
    </div>
  );
}
