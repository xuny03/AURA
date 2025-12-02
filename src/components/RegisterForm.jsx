import { useState } from "react";
import { API_URL } from "../config";
import { saveAuth } from "./auth/auth";
export default function RegisterForm() {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          password
        })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Error al crear la cuenta");
      }

      const data = await res.json();
      saveAuth(data);
      window.location.href = "/";

    } catch (err) {
      setError(err.message || "No se pudo completar el registro");

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="aura-login-page">

      <div className="aura-register-glow"></div>

      <form className="aura-register-card" onSubmit={handleSubmit}>

        <h1 className="aura-register-title">REGISTRARSE</h1>

        <p className="aura-register-subtitle">
          Crea tu cuenta Aura
        </p>

        <div className="aura-input-group">
          <input
            type="text"
            placeholder="Usuario"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
          />
        </div>

        <div className="aura-input-group">
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </div>

        {error && (
          <div className="aura-error">
            {error}
          </div>
        )}

        <button
          className="aura-register-btn"
          disabled={loading}
        >
          {loading ? "Creando cuenta..." : "Registrarse"}
        </button>

        <div style={{ marginTop: "1rem", textAlign: "center" }}>
            <span className="aura-login-link2">¿Ya tienes cuenta? </span>
          <a href="/login" className="aura-login-link">
            Inicia sesión
          </a>
        </div>

      </form>
    </div>
  );
}
