import React, { useEffect, useState } from "react";
import CartPreview from "./CartPreview.jsx";

export default function CartIcon() {
  const [cart, setCart] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const readCartFromStorage = () => {
      try {
        const saved = localStorage.getItem("cart");
        setCart(saved ? JSON.parse(saved) : []);
      } catch (e) {
        console.error("Error leyendo carrito:", e);
        setCart([]);
      }
    };

    readCartFromStorage();

    const handleCartUpdated = (event) => {
      setCart(event.detail || []);
    };

    window.addEventListener("cart-updated", handleCartUpdated);
    return () => {
      window.removeEventListener("cart-updated", handleCartUpdated);
    };
  }, []);

  const totalItems = cart.reduce(
    (acc, item) => acc + (item.quantity || 1),
    0
  );

  return (
    <div
      className="cart-wrapper"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <a href="/cart" className="position-relative cart-icon-link">
        <span style={{ fontSize: "24px", color: "white" }}>🛒</span>

        {totalItems > 0 && (
          <span
            className="badge bg-danger rounded-pill position-absolute"
            style={{
              top: "-6px",
              right: "-10px",
              padding: "3px 8px",
              fontSize: "0.75rem",
            }}
          >
            {totalItems}
          </span>
        )}
      </a>

      {open && (
        <div className="cart-preview-container">
          <CartPreview cart={cart} />
        </div>
      )}
    </div>
  );
}
