import React, { useEffect, useState } from "react";
import { getCart, saveCart } from "../auth/cartStorage";

export default function CartPreview() {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const readCart = () => setCart(getCart());

    readCart();
    window.addEventListener("cart-updated", readCart);

    return () => window.removeEventListener("cart-updated", readCart);
  }, []);

  if (!cart || cart.length === 0) {
    return <div className="cart-preview-empty">Carrito vacío</div>;
  }

  const increaseQty = (id) => {
    const updated = cart.map(item =>
      item.id === id ? { ...item, quantity: item.quantity + 1 } : item
    );

    saveCart(updated);
    window.dispatchEvent(new CustomEvent("cart-updated"));
  };

  const decreaseQty = (id) => {
    const updated = cart
      .map(item =>
        item.id === id ? { ...item, quantity: item.quantity - 1 } : item
      )
      .filter(item => item.quantity > 0);

    saveCart(updated);
    window.dispatchEvent(new CustomEvent("cart-updated"));
  };

  return (
    <div className="cart-preview">
      <ul className="cart-preview-list scrollable">
        {cart.map(item => (
          <li key={item.id} className="cart-preview-item">
            <img src={item.image} alt={item.name} className="cart-preview-img" />

            <div className="cart-preview-info">
              <span className="cart-preview-name">{item.name}</span>

              <div className="qty-controls">
                <button className="qty-btn" onClick={() => decreaseQty(item.id)}>
                  −
                </button>

                <span className="cart-preview-qty">{item.quantity}</span>

                <button className="qty-btn" onClick={() => increaseQty(item.id)}>
                  +
                </button>
              </div>
            </div>

            <div className="cart-preview-price">
              {(item.price * item.quantity).toFixed(2)} €
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
