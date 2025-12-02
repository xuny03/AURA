import React, { useEffect, useState } from "react";
import { isAdmin } from "../auth/auth";

const formatPrice = (value) =>
  new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
  }).format(value || 0);

export default function OrdersPage() {

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const url = "http://localhost:8080/api/orders";

      const token = localStorage.getItem("token");

      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!res.ok) {
        throw new Error(`HTTP Error ${res.status}`);
      }

      const data = await res.json();
      console.log("BACKEND RESPONSE →", data);

      setOrders(data);
    } catch (err) {
      console.error("❌ Error cargando pedidos:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {

    // 🛑 PROTECCIÓN FRONT
    if (!isAdmin()) {
      window.location.href = "/";
      return;
    }

    fetchOrders();

  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "PENDING":
        return "#fbbf24";
      case "SHIPPED":
        return "#38bdf8";
      case "DELIVERED":
        return "#4ade80";
      case "CANCELLED":
        return "#f43f5e";
      default:
        return "#a855f7";
    }
  };

  if (!isAdmin()) return null;

  if (loading) {
    return <div className="orders-loading">Cargando pedidos...</div>;
  }

  return (
    <section className="orders-page container py-4">

      <h1 className="orders-title">Pedidos</h1>

      <p className="orders-subtitle">
        Vista administrativa completa de pedidos del sistema.
      </p>

      <div className="orders-list">

        {orders.length === 0 && (
          <p className="orders-empty">No existen pedidos todavía.</p>
        )}

        {orders.map((order) => (
          <div key={order.id} className="order-card aura-card aura-border-glow">

            <div className="order-header">
              <h2>Pedido #{order.id}</h2>

              <span
                className="order-status"
                style={{ backgroundColor: getStatusColor(order.status) }}
              >
                {order.status}
              </span>
            </div>

            <div className="order-info">
              <p><strong>ID Usuario:</strong> {order.userId}</p>

              {order.couponCode && (
                <p>
                  <strong>Cupón aplicado:</strong> {order.couponCode}
                </p>
              )}

              <p>
                <strong>Total:</strong> {formatPrice(order.total)}
              </p>
            </div>

            <div className="order-items">
              {order.items.map((item, i) => (
                <div key={i} className="order-item">
                  <span>Producto #{item.productId}</span>
                  <span>x{item.quantity}</span>
                </div>
              ))}
            </div>

            <div className="order-footer">
              <a href={`/orders/${order.id}`} className="aura-btn-glass-neon">
                <span>Ver detalles</span>
              </a>
            </div>

          </div>
        ))}
      </div>
    </section>
  );
}
