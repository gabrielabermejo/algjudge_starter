import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ChallengeRepositoryImpl } from "../../data/repositories/ChallengeRepositoryImpl";

const repo = new ChallengeRepositoryImpl();

export default function ChallengeDetailPage() {
  const { id } = useParams();
  const nav = useNavigate();

  const [challenge, setChallenge] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError("");
        const c = await repo.getById(id);
        setChallenge(c);
      } catch (err) {
        console.error("Error cargando reto:", err);
        setError("No se pudo cargar el reto.");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [id]);

  if (loading) {
    return (
      <div style={{ padding: 20 }}>
        <h2>Detalle del Reto</h2>
        <p>Cargando...</p>
      </div>
    );
  }

  if (error || !challenge) {
    return (
      <div style={{ padding: 20 }}>
        <h2>Detalle del Reto</h2>
        <p style={{ color: "red" }}>{error || "Reto no encontrado."}</p>
        <button onClick={() => nav("/challenges")}>Volver a retos</button>
      </div>
    );
  }

  const c = challenge;

  return (
    <div style={{ padding: 20 }}>
      <Link to="/challenges" style={{ marginBottom: 10, display: "inline-block" }}>
        ← Volver a retos
      </Link>

      <div
        style={{
          padding: "20px",
          borderRadius: "8px",
          border: "1px solid #ddd",
          boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
          background: "#fff",
          maxWidth: "800px",
        }}
      >
        <h2 style={{ marginTop: 0 }}>{c.title}</h2>

        <p style={{ marginTop: 0, color: "#555" }}>{c.description}</p>

        <p>
          <strong>Dificultad:</strong> {c.difficulty}{" "}
          {c.state && (
            <>
              {" | "}
              <strong>Estado:</strong> {c.state}
            </>
          )}
        </p>

        {c.tags && c.tags.length > 0 && (
          <p>
            <strong>Tags:</strong> {c.tags.join(", ")}
          </p>
        )}

        <p style={{ fontSize: "0.9rem", color: "#666" }}>
          {c.timeLimit && <>TL: {c.timeLimit} ms</>}
          {c.timeLimit && c.memoryLimit && " | "}
          {c.memoryLimit && <>ML: {c.memoryLimit} MB</>}
        </p>

        <button
          style={{
            marginTop: "20px",
            padding: "10px 16px",
            background: "#4e5af7",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
          onClick={() => nav(`/challenges/${id}/submit`, {
            state: { title: c.title },
          })}
        >
          Enviar solución
        </button>
      </div>
    </div>
  );
}
