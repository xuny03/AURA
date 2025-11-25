import { useMemo, useState } from "react";
import ProductCard from "./ProductCard.jsx";

const PAGE_SIZE = 48;

export default function ProductGrid({ products, simpleMode = false }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [manufacturer, setManufacturer] = useState("all");
  const [page, setPage] = useState(1);

  // listas únicas para selects
  const categories = useMemo(() => {
    const set = new Set(products.map((p) => p.category || "otros"));
    return ["all", ...Array.from(set)];
  }, [products]);

  const manufacturers = useMemo(() => {
    const set = new Set(
      products
        .map((p) => (p.manufacturer || "Desconocido").trim())
        .filter(Boolean)
    );
    return ["all", ...Array.from(set)];
  }, [products]);

  const filtered = useMemo(() => {
    const text = search.trim().toLowerCase();
    return products.filter((p) => {
      const name = (p.name || "").toLowerCase();
      const cat = (p.category || "otros").toLowerCase();
      const manu = (p.manufacturer || "desconocido").trim();

      const matchesText = !text || name.includes(text);
      const matchesCat = category === "all" || cat === category.toLowerCase();
      const matchesManu = manufacturer === "all" || manu === manufacturer;

      return matchesText && matchesCat && matchesManu;
    });
  }, [products, search, category, manufacturer]);

  // reset página cuando cambian filtros/búsqueda
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const start = simpleMode ? 0 : (currentPage - 1) * PAGE_SIZE;
  const end = simpleMode ? filtered.length : start + PAGE_SIZE;
  const pageItems = filtered.slice(start, end);

  const handleChangeFilter = (fn) => (e) => {
    fn(e.target.value);
    setPage(1);
  };

  const goPrev = () => setPage((p) => Math.max(1, p - 1));
  const goNext = () => setPage((p) => Math.min(totalPages, p + 1));

  return (
    <div className="mt-3">
      {!simpleMode && (
        <div className="p-4 aura-card mb-4">
          <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-3">
            <h4 className="mb-0">Filtros</h4>
            <span className="small text-secondary">
              {filtered.length.toLocaleString("es-ES")} resultados
            </span>
          </div>

          <div className="row g-3">
            <div className="col-12 col-md-4">
              <label className="form-label small">Buscar</label>
              <input
                type="text"
                className="form-control"
                placeholder="Nombre del componente..."
                value={search}
                onChange={handleChangeFilter(setSearch)}
              />
            </div>

            <div className="col-12 col-md-4">
              <label className="form-label small">Categoría</label>
              <select
                className="form-select"
                value={category}
                onChange={handleChangeFilter(setCategory)}
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c === "all" ? "Todas" : c.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-12 col-md-4">
              <label className="form-label small">Fabricante</label>
              <select
                className="form-select"
                value={manufacturer}
                onChange={handleChangeFilter(setManufacturer)}
              >
                {manufacturers.map((m) => (
                  <option key={m} value={m}>
                    {m === "all" ? "Todos" : m}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      <div className="row g-4">
        {pageItems.map((p) => (
          <div className="col-12 col-sm-6 col-md-4 col-lg-3" key={p.id}>
            <ProductCard product={p} />
          </div>
        ))}

        {pageItems.length === 0 && (
          <div className="col-12">
            <p className="text-secondary mb-0">
              No se han encontrado productos con los filtros actuales.
            </p>
          </div>
        )}
      </div>

      {!simpleMode && totalPages > 1 && (
        <div className="d-flex justify-content-between align-items-center mt-4">
          <button
            className="btn btn-sm btn-outline-light"
            onClick={goPrev}
            disabled={currentPage === 1}
          >
            ◀ Anterior
          </button>
          <span className="small text-secondary">
            Página {currentPage} de {totalPages}
          </span>
          <button
            className="btn btn-sm btn-outline-light"
            onClick={goNext}
            disabled={currentPage === totalPages}
          >
            Siguiente ▶
          </button>
        </div>
      )}
    </div>
  );
}
