import { useState } from "react";
import { API_URL } from "../config";
import { saveAuth } from "./auth/auth";

export default function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      if (!res.ok) {
        setError("Usuario o contraseña incorrectos");
        return;
      }

      const data = await res.json();
      localStorage.setItem("roles", JSON.stringify(data.roles));
      saveAuth(data);

      window.location.href = "/";
    } catch {
      setError("Error de conexión con el servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="aura-login-page">
      <div className="aura-login-glow"></div>

      <form className="aura-login-card" onSubmit={handleSubmit}>
        <h1 className="aura-login-title">LOGIN</h1>
        <p className="aura-login-subtitle">
          Accede a tu área de construcción Aura
        </p>

        <div className="aura-input-group">
          <input
            type="text"
            placeholder="Usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div className="aura-input-group">
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {error && <div className="aura-error">{error}</div>}

        <button className="aura-login-btn" type="submit" disabled={loading}>
          {loading ? "Accediendo..." : "Entrar"}
        </button>
        <div style={{ marginTop: "1rem", textAlign: "center" }}>
          <span className="aura-login-link2">¿No tienes cuenta? </span>
          <a href="/register" className="aura-login-link">
            Regístrate
          </a>
        </div>
      </form>
    </div>
  );
}
