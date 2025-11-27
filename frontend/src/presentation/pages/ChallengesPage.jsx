import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ChallengeRepositoryImpl } from "../../data/repositories/ChallengeRepositoryImpl";
import { listChallenges } from "../../core/usecases/listChallenges";

const repo = new ChallengeRepositoryImpl();

export default function ChallengesPage() {
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError("");
        const result = await listChallenges(repo);
        setChallenges(result);
      } catch (err) {
        console.error("Error cargando retos:", err);
        setError("No se pudieron cargar los retos.");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: 20 }}>
        <h2>Retos Disponibles</h2>
        <p>Cargando...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: 20 }}>
        <h2>Retos Disponibles</h2>
        <p style={{ color: "red" }}>{error}</p>
      </div>
    );
  }

  if (!challenges.length) {
    return (
      <div style={{ padding: 20 }}>
        <h2>Retos Disponibles</h2>
        <p>No hay retos creados todavía.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Retos Disponibles</h2>

      <div style={{ marginTop: 20, display: "grid", gap: "16px" }}>
        {challenges.map((c) => (
          <Link
            key={c.id}
            to={`/challenges/${c.id}`}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <div
              style={{
                padding: "16px",
                borderRadius: "8px",
                border: "1px solid #ddd",
                boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
                background: "#fff",
              }}
            >
              <h3 style={{ margin: "0 0 8px 0" }}>{c.title}</h3>
              <p style={{ margin: "0 0 8px 0", color: "#555" }}>
                {c.description}
              </p>

              <div style={{ fontSize: "0.9rem", color: "#666" }}>
                <strong>Dificultad:</strong> {c.difficulty}{" "}
                {c.state && (
                  <>
                    {" | "}
                    <strong>Estado:</strong> {c.state}
                  </>
                )}
              </div>

              {c.tags && c.tags.length > 0 && (
                <div
                  style={{
                    marginTop: 8,
                    fontSize: "0.85rem",
                    color: "#444",
                  }}
                >
                  <strong>Tags:</strong> {c.tags.join(", ")}
                </div>
              )}

              {(c.timeLimit || c.memoryLimit) && (
                <div
                  style={{
                    marginTop: 4,
                    fontSize: "0.8rem",
                    color: "#777",
                  }}
                >
                  {c.timeLimit && <>TL: {c.timeLimit} ms</>}
                  {c.timeLimit && c.memoryLimit && " | "}
                  {c.memoryLimit && <>ML: {c.memoryLimit} MB</>}
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
