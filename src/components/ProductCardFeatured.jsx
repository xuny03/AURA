import React from "react";
import { motion } from "framer-motion";

// Función para formatear el precio
function formatPrice(price) {
  if (!price || price < 0) return "Precio N/D";
  return price.toLocaleString("es-ES") + " €";
}

export default function ProductCardFeatured({ product }) {
  return (
    <motion.div
      className="featured-card"
      initial={{ opacity: 0, y: 20, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.35 }}
    >
      {/* Fondo futurista */}
      <div
        className="featured-card-image"
        style={{
          background:
            "radial-gradient(circle at top, rgba(0,180,255,0.3), transparent), radial-gradient(circle at bottom, rgba(180,80,255,0.25), transparent)",
          height: "110px",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
        }}
      />

      <div className="featured-card-body">
        <div className="d-flex justify-content-between">
          <span className="featured-chip">
            {(product.category || "").toUpperCase()}
          </span>
          <span className="featured-brand">{product.manufacturer || ""}</span>
        </div>

        <h5 className="featured-title">{product.name}</h5>

        {/* PRECIO CORREGIDO */}
        <p className="featured-price">
          {formatPrice(product.price)}
        </p>
        <div className="featured-actions">
  <button className="featured-btn-add">
    Agregar a build
  </button>

  <a href={`/product/${product.id}`} className="featured-btn-view">
    Ver más
  </a>
</div>
        </div>
    </motion.div>
  );
}
