import { motion } from "framer-motion";

export default function AnimCard({ title, subtitle, badge, children }) {
  return (
    <motion.div
      className="aura-card p-4 p-md-5 aura-border-glow h-100"
      initial={{ opacity: 0, y: 30, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      whileHover={{
        scale: 1.02,
        boxShadow: "0 0 40px rgba(56,189,248,0.75)",
        translateY: -4,
      }}
    >
      <div className="d-flex justify-content-between align-items-start mb-3">
        <div>
          {badge && <span className="aura-chip mb-2 d-inline-block">{badge}</span>}
          <h2 className="h4 mb-1">{title}</h2>
          {subtitle && <p className="text-secondary mb-0 small">{subtitle}</p>}
        </div>
        <div
          style={{
            width: "34px",
            height: "34px",
            borderRadius: "999px",
            border: "1px solid rgba(148,163,184,0.6)",
            boxShadow: "0 0 16px rgba(56,189,248,0.7)",
          }}
        />
      </div>
      {children && <div className="mt-3 text-secondary small">{children}</div>}
    </motion.div>
  );
}
