import React from "react";
import { CartProvider } from "../context/CartContext.jsx";

export default function ReactShell({ children }) {
  return <CartProvider>{children}</CartProvider>;
}
