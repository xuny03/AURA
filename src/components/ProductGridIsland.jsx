import { useMemo, useState } from "react";
import ProductCard from "./ProductCard.jsx";

function resolveCategory(id) {
  const map = {
    1: "Periféricos",
    2: "Componentes",
    3: "Monitores",
    11: "CPU",
    12: "GPU",
  };
  return map[id] || "Otros";
}

export default function ProductGridIsland({
  products = [],
  currentPage,
  totalPages,
}) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Todas");

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (!p?.name) return false;

      const matchSearch = p.name
        .toLowerCase()
        .includes(search.toLowerCase());

      const catName = resolveCategory(p.category?.id || p.categoryId);

      const matchCategory =
        category === "Todas" || catName === category;

      return matchSearch && matchCategory;
    });
  }, [products, search, category]);

  const goToPage = (p) => {
    window.location.href = `?page=${p}`;
  };
  const isFiltering =
    search.trim() !== "" || category !== "Todas"
  return (
    <>
      {/* 🧩 FILTROS */}
      <div className="filters-box mb-4">
        <input
          className="form-control mb-2"
          placeholder="Buscar componente..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="form-select"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="Todas">Todas</option>
          <option value="CPU">CPU</option>
          <option value="GPU">GPU</option>
          <option value="Componentes">Componentes</option>
          <option value="Monitores">Monitores</option>
          <option value="Periféricos">Periféricos</option>
        </select>

        <p className="filters-meta">
          Página {currentPage + 1} / {totalPages}
        </p>
      </div>

      {/* 🛒 GRID */}
      <div className="product-grid">
        {filtered.length === 0 ? (
          <p className="aura-empty-state">
            No hay resultados
          </p>
        ) : (
          filtered.map((product) => (
            <ProductCard
              key={product.id}
              product={{
                ...product,
                category: resolveCategory(product.category?.id || product.categoryId),
                manufacturer: "Aura",
              }}
            />
          ))
        )}
      </div>

      {/* 🔢 PAGINACIÓN */}
      {!isFiltering && totalPages > 1 && (
        <div className="aura-pagination">
          <button
            disabled={currentPage === 0}
            className="aura-btn-glass-neon"
            onClick={() => goToPage(currentPage - 1)}
          >
            ← Anterior
          </button>

          <span className="page-indicator">
            {currentPage + 1} / {totalPages}
          </span>

          <button
            disabled={currentPage >= totalPages - 1}
            className="aura-btn-glass-neon"
            onClick={() => goToPage(currentPage + 1)}
          >
            Siguiente →
          </button>
        </div>
      )}
    </>
  );
}
