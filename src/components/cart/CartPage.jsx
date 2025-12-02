import React, { useEffect, useState, useMemo } from "react";
import { getCart, saveCart, clearCart as clearUserCart } from "../auth/cartStorage";


const formatPrice = (value) => {
  if (value == null || isNaN(value)) return "N/D";
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
  }).format(value);
};

export default function CartPage() {
  const [cart, setCart] = useState([]);

  // Carga inicial + suscripción a cambios
 // Carga inicial + escucha de cambios
useEffect(() => {
  if (typeof window === "undefined") return;

  const readCart = () => {
    const data = getCart();
    setCart(data);
  };

  readCart();

  const handleCartUpdated = () => readCart();

  window.addEventListener("cart-updated", handleCartUpdated);

  return () => window.removeEventListener("cart-updated", handleCartUpdated);
}, []);


  const persistCart = (updated) => {
  saveCart(updated);
  window.dispatchEvent(new CustomEvent("cart-updated"));
  setCart(updated);
};


  const updateQty = (id, delta) => {
    const updated = cart
      .map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(0, (item.quantity || 1) + delta) }
          : item
      )
      .filter((item) => item.quantity > 0);

    persistCart(updated);
  };

  const removeItem = (id) => {
    const updated = cart.filter((item) => item.id !== id);
    persistCart(updated);
  };

  const clearCart = () => {
  clearUserCart();
  setCart([]);
};


  const { itemsTotal, itemCount } = useMemo(() => {
    const itemsTotal = cart.reduce(
      (acc, item) => acc + (item.price || 0) * (item.quantity || 1),
      0
    );
    const itemCount = cart.reduce((acc, item) => acc + (item.quantity || 1), 0);
    return { itemsTotal, itemCount };
  }, [cart]);

  if (cart.length === 0) {
    return (
      <section className="aura-cart-page container py-5">
        <div className="aura-cart-empty aura-card aura-border-glow">
          <h1 className="aura-cart-title">Tu carrito está vacío</h1>
          <p className="aura-cart-subtitle">
            Empieza a construir tu setup definitivo explorando el catálogo.
          </p>
          <a href="/products" className="aura-btn-neon aura-cart-cta">
            <span>Ver catálogo</span>
          </a>
        </div>
      </section>
    );
  }

  return (
    <section className="aura-cart-page container py-4">
      <div className="aura-cart-header">
        <span className="aura-chip">Aura · Carrito</span>
        <h1 className="aura-cart-title">Resumen de tu build</h1>
        <p className="aura-cart-subtitle">
          Revisa los componentes, ajusta cantidades y cuando estés listo,
          continúa con la compra.
        </p>
      </div>

      <div className="aura-cart-layout">
        {/* Lista de productos */}
        <div className="aura-cart-items aura-card aura-border-glow">
          {cart.map((item) => (
            <div key={item.id} className="aura-cart-item">
              <div className="aura-cart-item-main">
                <img
                  src={item.image}
                  alt={item.name}
                  className="aura-cart-item-img"
                />

                <div className="aura-cart-item-info">
                  <h3 className="aura-cart-item-name">{item.name}</h3>
                  {item.category && (
                    <span className="aura-cart-item-category">
                      {item.category}
                    </span>
                  )}
                  <span className="aura-cart-item-unit">
                    Precio unitario:{" "}
                    <strong>{formatPrice(item.price || 0)}</strong>
                  </span>
                </div>
              </div>

              <div className="aura-cart-item-side">
                <div className="qty-controls aura-cart-qty-controls">
                  <button
                    className="qty-btn"
                    onClick={() => updateQty(item.id, -1)}
                  >
                    −
                  </button>
                  <span className="cart-preview-qty">{item.quantity || 1}</span>
                  <button
                    className="qty-btn"
                    onClick={() => updateQty(item.id, +1)}
                  >
                    +
                  </button>
                </div>

                <div className="aura-cart-item-total">
                  {formatPrice((item.price || 0) * (item.quantity || 1))}
                </div>

                <button
                  className="aura-cart-remove"
                  onClick={() => removeItem(item.id)}
                >
                  Quitar
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Resumen */}
        <aside className="aura-cart-summary aura-card aura-border-glow">
          <h2 className="aura-cart-summary-title">Resumen</h2>

          <div className="aura-cart-summary-row">
            <span>Productos</span>
            <span>{itemCount}</span>
          </div>

          <div className="aura-cart-summary-row">
            <span>Subtotal</span>
            <span>{formatPrice(itemsTotal)}</span>
          </div>

          <div className="aura-cart-summary-row aura-cart-summary-row-muted">
            <span>Envío</span>
            <span>Calculado en el siguiente paso</span>
          </div>

          <hr className="aura-cart-divider" />

          <div className="aura-cart-summary-row aura-cart-summary-total">
            <span>Total estimado</span>
            <span>{formatPrice(itemsTotal)}</span>
          </div>

          <div className="aura-cart-summary-actions">
            <button
              type="button"
              className="aura-cart-clear"
              onClick={clearCart}
            >
              Vaciar carrito
            </button>

            <a
              href="/checkout"
              className="aura-cart-checkout aura-btn-neon"
              style={{ textAlign: "center" }}
            >
              <span>Continuar con el pedido</span>
            </a>
          </div>
        </aside>
      </div>
    </section>
  );
}
