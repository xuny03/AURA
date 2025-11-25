import { motion } from "framer-motion";
import useCart from "../hooks/useCart.js";

// ----------------------------
//  RESUMEN DE ESPECIFICACIONES
// ----------------------------
function getSpecsSummary(product) {
  const cat = (product.category || "").toLowerCase();

  if (cat === "cpu") {
    return [
      `${product.cores ?? "?"}c / ${product.threads ?? "?"}t`,
      [
        product.baseClock && `${product.baseClock} GHz`,
        product.boostClock && `${product.boostClock} GHz`,
      ]
        .filter(Boolean)
        .join(" · "),
      product.socket && `Socket ${product.socket}`,
    ].filter(Boolean);
  }

  if (cat === "gpu") {
    return [product.vram ? `${product.vram} GB VRAM` : null].filter(Boolean);
  }

  if (cat === "ram") {
    return [
      product.capacity ? `${product.capacity} GB` : null,
      product.speed ? `${product.speed} MHz` : null,
    ].filter(Boolean);
  }

  if (cat === "storage") {
    return [
      product.capacity ? `${product.capacity} GB` : null,
      product.type,
    ].filter(Boolean);
  }

  if (cat === "motherboard") {
    return [product.socket && `Socket ${product.socket}`].filter(Boolean);
  }

  return [];
}

// ----------------------------
//       TARJETA DE PRODUCTO
// ----------------------------
export default function ProductCard({ product }) {
  // ⭐ Hooks SIEMPRE dentro del componente
  const { addToCart } = useCart() || {};

  const specs = getSpecsSummary(product);
  const catLabel = (product.category || "other").toUpperCase();
  const manufacturer = product.manufacturer || "Desconocido";

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
      {/* 🔥 Toda la tarjeta clicable excepto el botón */}
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

        {specs.length > 0 && (
          <ul className="small text-secondary mb-2 ps-3">
            {specs.map((s, idx) => (
              <li key={idx}>{s}</li>
            ))}
          </ul>
        )}

        <p className="fw-semibold mb-3">{priceText}</p>
      </a>

      {/* Botón independiente */}
      <button
        className="mt-auto aura-btn-neon"
        onClick={(e) => {
          e.preventDefault(); // evita romper el enlace del card-click
          addToCart(product);
        }}
      >
        <span>Agregar a build</span>
      </button>
    </motion.div>
  );
}
