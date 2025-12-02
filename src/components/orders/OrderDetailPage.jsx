import React, { useEffect, useState } from "react";

const formatPrice = (value) =>
  new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
  }).format(value || 0);

export default function OrderDetailPage({ id }) {
  const [order, setOrder] = useState(null);
  const [products, setProducts] = useState({});
  const [loading, setLoading] = useState(true);

  // ============================
  // GET pedido
  // ============================
  const fetchOrder = async () => {
  const token = localStorage.getItem("token");

  const res = await fetch(`http://localhost:8080/api/orders/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (!res.ok) {
    throw new Error("No autorizado");
  }

  const data = await res.json();
  setOrder(data);
};


  // ============================
  // GET detalles de cada producto
  // ============================
  const fetchProduct = async (productId) => {
    if (products[productId]) return; // cache simple

    try {
      const res = await fetch(`http://localhost:8080/api/products/${productId}`);
      const data = await res.json();

      setProducts((prev) => ({
        ...prev,
        [productId]: data,
      }));
    } catch (error) {
      console.error("Error cargando producto", error);
    }
  };

  useEffect(() => {
    const load = async () => {
      await fetchOrder();
      setLoading(false);
    };
    load();
  }, [id]);

  useEffect(() => {
    if (!order) return;
    order.items.forEach((item) => fetchProduct(item.productId));
  }, [order]);

  if (loading || !order) {
    return <div className="orders-loading">Cargando pedido...</div>;
  }

  return (
    <section className="order-detail container py-4">
      <h1 className="orders-title">Pedido #{order.id}</h1>

      <div className="order-detail-layout">
        
        {/* INFO DEL PEDIDO */}
        <div className="order-detail-card aura-card aura-border-glow">
          <h2 className="detail-section-title">Información</h2>

          <p><strong>Estado:</strong> {order.status}</p>
          <p><strong>Total pagado:</strong> {formatPrice(order.total)}</p>

          {order.couponCode && (
            <p><strong>Cupón aplicado:</strong> {order.couponCode}</p>
          )}

          <p><strong>ID Usuario:</strong> {order.userId}</p>
        </div>

        {/* LISTA DE PRODUCTOS */}
        <div className="order-detail-card aura-card aura-border-glow">
          <h2 className="detail-section-title">Productos</h2>

          <div className="order-detail-items">
            {order.items.map((item, index) => {
              const product = products[item.productId];

              return (
                <div key={index} className="order-detail-item">
                  
                  <img
                    src={product?.imageUrl || "/images/placeholder.png"}
                    className="order-detail-img"
                  />

                  <div className="order-detail-info">
                    <p className="order-detail-name">
                      {product?.name || `Producto #${item.productId}`}
                    </p>

                    <p className="order-detail-qty">
                      Cantidad: <strong>x{item.quantity}</strong>
                    </p>

                    {product?.price && (
                      <p className="order-detail-price">
                        Precio: {formatPrice(product.price)}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
