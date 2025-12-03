import React, { useEffect, useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const formatPrice = (value) =>
  new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
  }).format(value || 0);

export default function OrderDetailPage({ id }) {
  const [order, setOrder] = useState(null);
  const [products, setProducts] = useState({});
  const [loading, setLoading] = useState(true);
  const [editOrder, setEditOrder] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));
  const isAdmin = user?.role === "ADMIN";

  const [newStatus, setNewStatus] = useState("");
  const [saving, setSaving] = useState(false);

  const generatePDF = () => {
    const doc = new jsPDF();

    //--------------------------
    // COLORES Y BRANDING
    //--------------------------
    const MAIN = [120, 0, 255]; // violeta aura

    //--------------------------
    // HEADER
    //--------------------------
    doc.setFillColor(...MAIN);
    doc.rect(0, 0, 210, 28, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.text("AURA", 14, 18);

    doc.setFontSize(12);
    doc.text("FACTURA", 165, 18);

    //--------------------------
    // INFO PEDIDO
    //--------------------------
    doc.setTextColor(0);

    doc.setFontSize(11);

    doc.text(`Pedido nº: ${order.id}`, 14, 42);
    doc.text(`Usuario ID: ${order.userId}`, 14, 48);
    doc.text(`Estado: ${order.status}`, 14, 54);

    const fecha = new Date().toLocaleDateString();
    doc.text(`Fecha: ${fecha}`, 150, 42);

    if (order.couponCode) {
      doc.text(`Cupón: ${order.couponCode}`, 150, 48);
    }

    //--------------------------
    // TABLA PRODUCTOS
    //--------------------------
    const tableData = order.items.map((item) => {
      const product = products[item.productId];
      const price = item.unitPrice;

      return [
        product?.name || `Producto #${item.productId}`,
        item.quantity,
        formatPrice(price),
        formatPrice(price * item.quantity),
      ];
    });

    autoTable(doc, {
      startY: 65,
      head: [["Producto", "Cantidad", "Precio Ud.", "Subtotal"]],
      body: tableData,
      theme: "striped",
      headStyles: {
        fillColor: MAIN,
      },
      styles: {
        halign: "center",
      },
      columnStyles: {
        0: { halign: "left" },
      },
    });

    //--------------------------
    // TOTALES
    //--------------------------
    const finalY = doc.lastAutoTable.finalY + 8;

    doc.setFontSize(12);
    doc.text(`TOTAL PAGADO: ${formatPrice(order.total)}`, 145, finalY);

    //--------------------------
    // FOOTER
    //--------------------------
    doc.setFontSize(10);
    doc.text("Gracias por comprar en AURA", 105, 285, {
      align: "center",
    });

    //--------------------------
    // DESCARGAR
    //--------------------------
    doc.save(`Factura-Pedido-${order.id}.pdf`);
  };
  const handleEditChange = (field, value) => {
    setEditOrder((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const saveFullOrder = async () => {
    try {
      setSaving(true);

      const token = localStorage.getItem("token");

      const res = await fetch(`http://localhost:8080/api/orders/${order.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editOrder),
      });

      if (!res.ok) {
        throw new Error("Error actualizando pedido");
      }

      const updated = await res.json();
      setOrder(updated);

      alert("✅ Pedido actualizado correctamente");
    } catch (err) {
      alert("❌ Error guardando pedido");
    } finally {
      setSaving(false);
    }
  };

  const updateOrderStatus = async () => {
    setSaving(true);

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `http://localhost:8080/api/orders/${order.id}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (!res.ok) throw new Error("Error al actualizar pedido");

      const updated = await res.json();
      setOrder(updated);

      alert("✅ Estado guardado");
    } catch {
      alert("❌ Error actualizando pedido");
    } finally {
      setSaving(false);
    }
  };

  // ============================
  // GET pedido
  // ============================
  const fetchOrder = async () => {
    const token = localStorage.getItem("token");

    const res = await fetch(`http://localhost:8080/api/orders/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      throw new Error("No autorizado");
    }

    const data = await res.json();
    setOrder(data);
  };


  useEffect(() => {
    const load = async () => {
      await fetchOrder();
      setLoading(false);
    };
    load();
  }, [id]);

  useEffect(() => {
    if (!order) return;

    setEditOrder({
      status: order.status || "PENDING",
      userId: order.userId,
      couponCode: order.couponCode || "",
      total: order.total || 0,
    });
  }, [order]);

  if (loading || !order) {
    return <div className="orders-loading">Cargando pedido...</div>;
  }

  return (
    <section className="order-detail container py-4">
      <h1 className="orders-title">Pedido #{order.id}</h1>

      <div className="order-detail-layout">
        {/* INFO DEL PEDIDO */}
        <div className="order-detail-card aura-card aura-border-glow">
          <h2 className="detail-section-title">Información</h2>

          <p>
            <strong>Estado:</strong> {order.status}
          </p>
          <p>
            <strong>Total pagado:</strong> {formatPrice(order.total)}
          </p>

          {order.couponCode && (
            <p>
              <strong>Cupón aplicado:</strong> {order.couponCode}
            </p>
          )}

          <p>
            <strong>ID Usuario:</strong> {order.userId}
          </p>
        </div>
        {isAdmin && editOrder && (
          <div className="order-detail-card aura-card aura-border-glow admin-panel">
            <h2 className="detail-section-title">Panel Admin</h2>

            <label>Estado</label>
            <select
              className="admin-select"
              value={editOrder.status}
              onChange={(e) => handleEditChange("status", e.target.value)}
            >
              <option value="PENDING">Pendiente</option>
              <option value="PAID">Pagado</option>
              <option value="SHIPPED">Enviado</option>
              <option value="COMPLETED">Completado</option>
              <option value="CANCELLED">Cancelado</option>
            </select>

            <label>ID Usuario</label>
            <input
              className="admin-input"
              type="number"
              value={editOrder.userId || ""}
              onChange={(e) =>
                handleEditChange("userId", Number(e.target.value))
              }
            />

            <label>Cupón</label>
            <input
              className="admin-input"
              type="text"
              value={editOrder.couponCode}
              onChange={(e) => handleEditChange("couponCode", e.target.value)}
            />

            <label>Total (€)</label>
            <input
              className="admin-input"
              type="number"
              step="0.01"
              min="0"
              value={editOrder.total.toFixed(2)}
              onChange={(e) =>
                handleEditChange(
                  "total",
                  parseFloat(parseFloat(e.target.value).toFixed(2))
                )
              }
            />

            <button
              disabled={saving}
              className="aura-btn aura-glow-btn admin-save"
              onClick={saveFullOrder}
            >
              {saving ? "Guardando..." : "💾 Guardar cambios"}
            </button>
          </div>
        )}

        {/* LISTA DE PRODUCTOS */}
        <div className="order-detail-card aura-card aura-border-glow">
          <h2 className="detail-section-title">Productos</h2>

          <div className="order-detail-items">
            {order.items.map((item, index) => {
              const product = products[item.productId];

              return (
                <div key={index} className="order-detail-item">
                  <img
                    src={product?.imageUrl || "/images/placeholder.png"}
                    className="order-detail-img"
                  />

                  <div className="order-detail-info">
                    <p className="order-detail-name">
                      {product?.name || `Producto #${item.productId}`}
                    </p>

                    <p className="order-detail-qty">
                      Cantidad: <strong>x{item.quantity}</strong>
                    </p>

                    {product?.price && (
                      <p className="order-detail-price">
                        Precio: {formatPrice(item.unitPrice)}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div className="invoice-btn-container">
        <button className="aura-btn aura-glow-btn" onClick={generatePDF}>
          📄 Descargar factura PDF
        </button>
      </div>
    </section>
  );
}
