import { Link, useNavigate } from "react-router-dom";
import { getCurrentUser, logout } from "../../data/repositories/AuthRepositoryImpl";

export default function Navbar() {
  const nav = useNavigate();
  const user = getCurrentUser();

  return (
    <nav
      style={{
        width: "100%",
        background: "#f0f0f0",
        padding: "12px 20px",
        display: "flex",
        gap: "20px",
        alignItems: "center",
        marginBottom: "20px",
        boxSizing: "border-box",
      }}
    >
      {/* Link a retos (solo logueado) */}
      {user && (
        <Link to="/challenges" style={{ fontWeight: "bold" }}>
          Retos
        </Link>
      )}

      {/* Botón para crear reto (solo si es ADMIN) */}
      {user?.role === "ADMIN" && (
        <Link to="/create-challenge" style={{ fontWeight: "bold" }}>
          Crear reto
        </Link>
      )}

      {/* Si no hay usuario → mostrar Login */}
      {!user && (
        <Link to="/login" style={{ fontWeight: "bold" }}>
          Login
        </Link>
      )}

      {/* Si hay usuario → botón de cerrar sesión */}
      {user && (
        <button
          style={{
            marginLeft: "auto",
            background: "transparent",
            border: "none",
            cursor: "pointer",
            fontWeight: "bold",
          }}
          onClick={() => {
            logout();
            nav("/login");
          }}
        >
          Cerrar sesión
        </button>
      )}
    </nav>
  );
}
