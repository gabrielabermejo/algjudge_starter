import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChallengeRepositoryImpl } from "../../data/repositories/ChallengeRepositoryImpl";
import { createChallenge } from "../../core/usecases/createChallenge";
import { getCurrentUser } from "../../data/repositories/AuthRepositoryImpl";

const repo = new ChallengeRepositoryImpl();

export default function CreateChallengePage() {
  const nav = useNavigate();
  const user = getCurrentUser();

  // si no es admin, bloqueamos la página
  if (!user || user.role !== "ADMIN") {
    return (
      <div style={{ padding: 20 }}>
        <h2>No autorizado</h2>
        <p>Solo un usuario ADMIN puede crear retos.</p>
      </div>
    );
  }

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [difficulty, setDifficulty] = useState("easy");
  const [tags, setTags] = useState("math, io");
  const [timeLimit, setTimeLimit] = useState(1000);
  const [memoryLimit, setMemoryLimit] = useState(128);
  const [state, setState] = useState("published");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [created, setCreated] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setCreated(null);
    setLoading(true);

    try {
      const dto = {
        title,
        description,
        difficulty,                    // 'easy' | 'medium' | 'hard'
        tags: tags
          .split(",")
          .map((t) => t.trim())
          .filter((t) => t.length > 0),
        timeLimit: Number(timeLimit),   // ms
        memoryLimit: Number(memoryLimit), // MB
        state,                          // 'draft' | 'published' | 'archived'
      };

      const challenge = await createChallenge(repo, dto);
      setCreated(challenge);
    } catch (err) {
      console.error("Error creando reto:", err);
      setError(err.message || "Error al crear el reto.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: 20, maxWidth: 600 }}>
      <h2>Crear nuevo reto</h2>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 12 }}>
          <label>
            Título:
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{ width: "100%", padding: 8, marginTop: 4 }}
              required
            />
          </label>
        </div>

        <div style={{ marginBottom: 12 }}>
          <label>
            Descripción:
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              style={{ width: "100%", padding: 8, marginTop: 4 }}
              required
            />
          </label>
        </div>

        <div style={{ marginBottom: 12 }}>
          <label>
            Dificultad:
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              style={{ marginLeft: 8 }}
            >
              <option value="easy">easy</option>
              <option value="medium">medium</option>
              <option value="hard">hard</option>
            </select>
          </label>
        </div>

        <div style={{ marginBottom: 12 }}>
          <label>
            Tags (separadas por coma):
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              style={{ width: "100%", padding: 8, marginTop: 4 }}
            />
          </label>
        </div>

        <div style={{ marginBottom: 12 }}>
          <label>
            Tiempo límite (ms):
            <input
              type="number"
              value={timeLimit}
              onChange={(e) => setTimeLimit(e.target.value)}
              style={{ width: "100%", padding: 8, marginTop: 4 }}
              min={1}
            />
          </label>
        </div>

        <div style={{ marginBottom: 12 }}>
          <label>
            Memoria límite (MB):
            <input
              type="number"
              value={memoryLimit}
              onChange={(e) => setMemoryLimit(e.target.value)}
              style={{ width: "100%", padding: 8, marginTop: 4 }}
              min={16}
            />
          </label>
        </div>

        <div style={{ marginBottom: 12 }}>
          <label>
            Estado:
            <select
              value={state}
              onChange={(e) => setState(e.target.value)}
              style={{ marginLeft: 8 }}
            >
              <option value="draft">draft</option>
              <option value="published">published</option>
              <option value="archived">archived</option>
            </select>
          </label>
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
            borderRadius: 6,
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          {loading ? "Creando..." : "Crear reto"}
        </button>
      </form>

      {created && (
        <div
          style={{
            marginTop: 20,
            padding: 12,
            borderRadius: 6,
            border: "1px solid #ddd",
            background: "#f8f8f8",
          }}
        >
          <p><strong>Reto creado:</strong> {created.title}</p>
          <p>ID: {created.id}</p>
          <button
            style={{
              marginTop: 8,
              padding: "6px 10px",
              borderRadius: 6,
              border: "none",
              background: "#4caf50",
              color: "#fff",
              cursor: "pointer",
              fontWeight: "bold",
            }}
            onClick={() => nav("/challenges")}
          >
            Ver lista de retos
          </button>
        </div>
      )}
    </div>
  );
}
