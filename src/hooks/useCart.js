import { useContext } from "react";
import CartContext from "../context/CartContext.jsx";

export default function useCart() {
  const ctx = useContext(CartContext);

  if (!ctx) {
    console.warn("useCart usado fuera de CartProvider");
    return null;
  }

  return ctx;
}
