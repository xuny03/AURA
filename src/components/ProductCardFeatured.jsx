import React from "react";
import { motion } from "framer-motion";
import useCart from "../hooks/useCart.js";

// Función para formatear el precio
function formatPrice(price) {
  if (!price || price < 0) return "Precio N/D";
  return price.toLocaleString("es-ES") + " €";
}

export default function ProductCardFeatured({ product }) {
  // ✅ Conexión al carrito
  const { addToCart } = useCart();

  const handleAdd = (e) => {
    e.preventDefault(); // evita que Swiper / links interfieran
    addToCart(product);
  };

  return (
    <motion.div
      className="featured-card"
      initial={{ opacity: 0, y: 20, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.35 }}
    >
      {/* Fondo futurista */}
      <div className="featured-card-image" />

      <div className="featured-card-body">
        <div className="d-flex justify-content-between">
          <span className="featured-chip">
            {(product.category || "AURA").toUpperCase()}
          </span>

          <span className="featured-brand">Aura</span>
        </div>

        <h5 className="featured-title">{product.name}</h5>

        <p className="featured-price">{formatPrice(product.price)}</p>

        <div className="featured-actions">
          {/* ✅ BOTÓN FUNCIONAL */}
          <button
            className="featured-btn-add"
            onClick={handleAdd}
          >
            Agregar a build
          </button>

          <a
            href={`/product/${product.id}`}
            className="featured-btn-view"
          >
            Ver más
          </a>
        </div>
      </div>
    </motion.div>
  );
}
