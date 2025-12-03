import React, { useEffect, useState } from "react";

// ==========================
// FORMATEADOR DE PRECIO
// ==========================
const formatPrice = (value) =>
  new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
  }).format(value || 0);

export default function ProfilePage() {

  const [token, setToken] = useState(null);
  const [profile, setProfile] = useState(null);
  const [orders, setOrders] = useState([]);

  const [username, setUsername] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [loadingOrders, setLoadingOrders] = useState(true);
  const [saving, setSaving] = useState(false);

  // ==========================
  // CARGA PRINCIPAL (CLIENTE)
  // ==========================
  useEffect(() => {
    if (typeof window === "undefined") return;

    const load = async () => {
      try {
        const t = localStorage.getItem("token");
        setToken(t);

        if (!t) return;

        // ==========================
        // PERFIL
        // ==========================
        const resProfile = await fetch("http://localhost:8080/api/users/me", {
          headers: {
            Authorization: `Bearer ${t}`,
          },
        });

        if (!resProfile.ok) throw new Error("Perfil no autorizado");

        const data = await resProfile.json();

        setProfile(data);
        setUsername(data.username);

        // ==========================
        // HISTORIAL PEDIDOS
        // ==========================
        const resOrders = await fetch(
          `http://localhost:8080/api/orders/user/${data.id}`,
          {
            headers: {
              Authorization: `Bearer ${t}`,
            },
          }
        );

        if (!resOrders.ok) throw new Error("Error cargando pedidos");

        const ordersData = await resOrders.json();
        setOrders(ordersData);
      } catch (err) {
        console.error(err);
        alert("❌ Error cargando perfil o pedidos");
      } finally {
        setLoadingOrders(false);
      }
    };

    load();
  }, []);

  // ==========================
  // GUARDAR PERFIL
  // ==========================
  const saveProfile = async () => {
    try {
      setSaving(true);

      const payload = {
        username,
        currentPassword,
        newPassword,
      };

      const res = await fetch("http://localhost:8080/api/users/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error("Error actualizando perfil");
      }

      const updated = await res.json();
      setProfile(updated);

      setCurrentPassword("");
      setNewPassword("");

      alert("✅ Perfil actualizado correctamente");
    } catch (err) {
      console.error(err);
      alert("❌ Error guardando perfil");
    } finally {
      setSaving(false);
    }
  };

  // ==========================
  // ESTADOS DE CARGA
  // ==========================
  if (!token) {
    return <div className="orders-loading">⏳ Cargando sesión...</div>;
  }

  if (!profile) {
    return <div className="orders-loading">⏳ Cargando perfil...</div>;
  }

  // ==========================
  // RENDER
  // ==========================
  return (
    <section className="profile container py-4">
      <h1 className="orders-title">Mi perfil</h1>

      {/* ======================= */}
      {/* PERFIL */}
      {/* ======================= */}
      <div className="order-detail-card aura-card aura-border-glow">

        <p><strong>ID:</strong> {profile.id}</p>
        <p><strong>Email:</strong> {profile.email}</p>
        <p><strong>Rol:</strong> {profile.role}</p>

        <hr />

        {/* USERNAME */}
        <label>Nombre de usuario</label>
        <input
          className="admin-input"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Nuevo nombre"
        />

        <hr />

        {/* PASSWORD */}
        <h3>Cambiar contraseña</h3>

        <label>Contraseña actual</label>
        <input
          className="admin-input"
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
        />

        <label>Nueva contraseña</label>
        <input
          className="admin-input"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />

        <button
          className="aura-btn aura-glow-btn admin-save"
          onClick={saveProfile}
          disabled={saving}
        >
          {saving ? "Guardando..." : "💾 Guardar cambios"}
        </button>
      </div>

      {/* ======================= */}
      {/* HISTORIAL PEDIDOS */}
      {/* ======================= */}

      <div className="profile-orders aura-card aura-border-glow">

        <h2 className="detail-section-title">
          📦 Mi historial de pedidos
        </h2>

        {loadingOrders ? (
          <p>Cargando pedidos...</p>
        ) : orders.length === 0 ? (
          <p>No tienes pedidos aún.</p>
        ) : (
          <div className="profile-orders-list">

            {orders.map((order) => (

              <a
                key={order.id}
                href={`/orders/${order.id}`}
                className="profile-order-item"
              >

                <p className="order-id">
                  Pedido #{order.id}
                </p>

                <p className={`order-status ${order.status}`}>
                  {order.status}
                </p>

                <p className="order-total">
                  {formatPrice(order.total)}
                </p>

                <p className="order-date">
                  {new Date(order.createdAt).toLocaleDateString("es-ES")}
                </p>

              </a>

            ))}

          </div>
        )}

      </div>
    </section>
  );
}
