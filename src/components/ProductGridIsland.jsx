import React from "react";
import { CartProvider } from "../context/CartContext.jsx";
import ProductGrid from "./ProductGrid.jsx";

export default function ProductGridIsland({ products }) {
  return (
    <CartProvider>
      <ProductGrid products={products} />
    </CartProvider>
  );
}
