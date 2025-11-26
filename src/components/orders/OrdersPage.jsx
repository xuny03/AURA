import React, { useEffect, useState } from "react";

const formatPrice = (value) =>
  new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
  }).format(value || 0);

export default function OrdersPage() {
  // TODO: reemplazar userId cuando tengas login real
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

 const fetchOrders = async () => {
  try {
    const url = "http://localhost:8080/api/orders";
    console.log("FRONTEND FETCH →", url);

    const res = await fetch(url);
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
    fetchOrders();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "PENDING":
        return "#fbbf24"; // Amarillo
      case "SHIPPED":
        return "#38bdf8"; // Azul
      case "DELIVERED":
        return "#4ade80"; // Verde
      case "CANCELLED":
        return "#f43f5e"; // Rojo
      default:
        return "#a855f7"; // Morado Aura
    }
  };

  if (loading) {
    return <div className="orders-loading">Cargando pedidos...</div>;
  }

  return (
    <section className="orders-page container py-4">
      <h1 className="orders-title">Pedidos realizados</h1>
      <p className="orders-subtitle">
        Consulta todos los pedidos asociados a tu cuenta.
      </p>

      <div className="orders-list">
        {orders.length === 0 && (
          <p className="orders-empty">Todavía no has realizado ningún pedido.</p>
        )}

        {orders.map((order) => (
          <div key={order.id} className="order-card aura-card aura-border-glow">
            
            {/* HEADER */}
            <div className="order-header">
              <h2>Pedido #{order.id}</h2>

              <span
                className="order-status"
                style={{
                  backgroundColor: getStatusColor(order.status),
                }}
              >
                {order.status}
              </span>
            </div>

            {/* INFO PRINCIPAL */}
            <div className="order-info">
              <p>
                <strong>ID Usuario:</strong> {order.userId}
              </p>

              {order.couponCode && (
                <p>
                  <strong>Cupón aplicado:</strong> {order.couponCode}
                </p>
              )}

              <p>
                <strong>Total:</strong> {formatPrice(order.total)}
              </p>
            </div>

            {/* LISTA DE ITEMS — Opción A: productId + quantity */}
            <div className="order-items">
              {order.items.map((item, i) => (
                <div key={i} className="order-item">
                  <span>Producto #{item.productId}</span>
                  <span>x{item.quantity}</span>
                </div>
              ))}
            </div>

            {/* FOOTER */}
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
