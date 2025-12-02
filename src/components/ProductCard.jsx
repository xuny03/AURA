import { motion } from "framer-motion";
import useCart from "../hooks/useCart.js";

export default function ProductCard({ product }) {
  if (!product) return null;

  const { addToCart } = useCart() || {};

  // ✅ Protección contra category que no sea string
  const catLabel = String(product.category || "other").toUpperCase();

  const manufacturer = product.manufacturer || "Aura";

  const priceText =
    product.price !== undefined && product.price !== null
      ? `${product.price.toLocaleString("es-ES")} €`
      : "Precio N/D";

  return (
    <motion.div
      className="aura-card p-3 h-100 d-flex flex-column"
      initial={{ opacity: 0, y: 18, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      whileHover={{
        scale: 1.03,
        boxShadow: "0 0 30px rgba(56,189,248,0.8)",
        translateY: -4,
      }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      {/* 🔥 Toda la tarjeta clicable */}
      <a
        href={`/product/${product.id}`}
        style={{
          textDecoration: "none",
          color: "inherit",
          display: "block",
        }}
      >
        <div
          className="mb-3"
          style={{
            borderRadius: 16,
            height: 130,
            background:
              "radial-gradient(circle at top, rgba(56,189,248,0.4), transparent 60%), radial-gradient(circle at bottom, rgba(168,85,247,0.3), transparent 55%)",
            border: "1px solid rgba(148,163,184,0.6)",
          }}
        />

        <div className="d-flex justify-content-between align-items-start mb-1">
          <span className="aura-chip">{catLabel}</span>
          <span className="small text-secondary">{manufacturer}</span>
        </div>

        <h5 className="mb-1" title={product.name}>
          {product.name}
        </h5>

        <p className="fw-semibold mb-3">{priceText}</p>
      </a>

      {/* ✅ Botón seguro */}
      <button
        className="mt-auto aura-btn-neon"
        onClick={(e) => {
          e.preventDefault();
          addToCart?.(product);
        }}
      >
        <span>Agregar a build</span>
      </button>
    </motion.div>
  );
}
