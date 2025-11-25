import React from "react";
import useCart from "../hooks/useCart";

export default function CartBubble() {
  const { cart } = useCart() || { cart: [] };

  return (
    <a
      href="/cart"
      className="cart-bubble"
      style={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
        width: "60px",
        height: "60px",
        borderRadius: "50%",
        background: "linear-gradient(135deg, #00c6ff, #7f00ff)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        color: "white",
        fontWeight: "bold",
        fontSize: "18px",
        cursor: "pointer",
        zIndex: 999999,
        boxShadow: "0 0 15px rgba(0,200,255,0.7)",
      }}
    >
      {cart.length}
    </a>
  );
}
