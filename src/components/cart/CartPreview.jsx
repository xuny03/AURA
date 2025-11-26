import React from "react";

export default function CartPreview({ cart }) {
  if (!cart || cart.length === 0) {
    return <div className="cart-preview-empty">Carrito vacío</div>;
  }

  // Aumentar 1 unidad
  const increaseQty = (id) => {
    const updated = cart.map((item) =>
      item.id === id ? { ...item, quantity: item.quantity + 1 } : item
    );
    localStorage.setItem("cart", JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent("cart-updated", { detail: updated }));
  };

  // Disminuir 1 unidad
  const decreaseQty = (id) => {
    const updated = cart
      .map((item) =>
        item.id === id ? { ...item, quantity: item.quantity - 1 } : item
      )
      .filter((item) => item.quantity > 0); // eliminar si queda en 0

    localStorage.setItem("cart", JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent("cart-updated", { detail: updated }));
  };

  return (
    <div className="cart-preview">
      <ul className="cart-preview-list scrollable">
        {cart.map((item) => (
          <li key={item.id} className="cart-preview-item">

            <img src={item.image} alt={item.name} className="cart-preview-img" />

            <div className="cart-preview-info">
              <span className="cart-preview-name">{item.name}</span>

              <div className="qty-controls">
                <button onClick={() => decreaseQty(item.id)} className="qty-btn">
                  −
                </button>

                <span className="cart-preview-qty">{item.quantity}</span>

                <button onClick={() => increaseQty(item.id)} className="qty-btn">
                  +
                </button>
              </div>
            </div>

            <div className="cart-preview-price">
              {item.price
                ? (item.price * item.quantity).toFixed(2) + " €"
                : "—"}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
