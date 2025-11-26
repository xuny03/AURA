import React, { useEffect, useState, useMemo } from "react";

const formatPrice = (value) =>
  new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
  }).format(value || 0);

export default function CheckoutPage() {
  const [cart, setCart] = useState([]);

  const [shippingMethod, setShippingMethod] = useState("standard");
  const [paymentMethod, setPaymentMethod] = useState("card");

  // CUPÓN
  const [coupon, setCoupon] = useState("");
  const [couponApplied, setCouponApplied] = useState(null);
  const [couponError, setCouponError] = useState("");

  // Cargar carrito desde localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = JSON.parse(localStorage.getItem("cart") || "[]");
      setCart(saved);
    }
  }, []);

  // Subtotal
  const total = useMemo(
    () => cart.reduce((acc, item) => acc + item.price * item.quantity, 0),
    [cart]
  );

  // =======================
  // 🔥 Aplicar cupón: BACKEND REAL
  // =======================
  const applyCoupon = async () => {
    const code = coupon.trim();

    if (!code) {
      setCouponError("Introduce un cupón");
      return;
    }

    try {
      const res = await fetch(`http://localhost:8080/api/coupons/${code}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        setCouponError("Cupón no válido");
        setCouponApplied(null);
        return;
      }

      const data = await res.json();

      // data = { id, code, type, value }
      if (!data.type || !data.value) {
        setCouponError("Cupón inválido");
        return;
      }

      setCouponApplied({
        code: data.code,
        type: data.type.toUpperCase(),
        amount: data.value,
      });

      setCouponError("");
    } catch (err) {
      console.error(err);
      setCouponError("Error al conectar con el servidor");
      setCouponApplied(null);
    }
  };

  // =======================
  // 🔥 Cálculo del envío
  // =======================
  let shippingCost =
    shippingMethod === "express"
      ? total > 100
        ? 4.99
        : 9.99
      : total > 100
      ? 0
      : 6.99;

  if (couponApplied?.type === "SHIPPING") {
    shippingCost = 0;
  }

  // =======================
  // 🔥 Cálculo del descuento
  // =======================
  const discount = useMemo(() => {
    if (!couponApplied) return 0;

    switch (couponApplied.type) {
      case "PERCENT":
        return (total * couponApplied.amount) / 100;

      case "FLAT":
        return couponApplied.amount;

      default:
        return 0;
    }
  }, [couponApplied, total]);

  // Total final
  const grandTotal = total + shippingCost - discount;

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Pedido realizado correctamente (simulado)");
  };

  return (
    <section className="checkout-page container py-4">
      <h1 className="checkout-title">Finalizar pedido</h1>
      <p className="checkout-subtitle">
        Completa tu información y revisa tu pedido antes de confirmar.
      </p>

      <form className="checkout-grid" onSubmit={handleSubmit}>
        {/* DATOS PERSONALES */}
        <div className="checkout-card aura-card aura-border-glow">
          <h2 className="checkout-section-title">Datos personales</h2>
          <label>
            Nombre completo
            <input type="text" required />
          </label>
          <label>
            Email
            <input type="email" required />
          </label>
          <label>
            Teléfono
            <input type="text" required />
          </label>
        </div>

        {/* DIRECCIÓN DE ENVÍO */}
        <div className="checkout-card aura-card aura-border-glow">
          <h2 className="checkout-section-title">Dirección de envío</h2>
          <label>
            Dirección
            <input type="text" required />
          </label>
          <label>
            Ciudad
            <input type="text" required />
          </label>
          <label>
            Código postal
            <input type="text" required />
          </label>
          <label>
            País
            <input type="text" required />
          </label>
        </div>

        {/* MÉTODO DE ENVÍO */}
        <div className="checkout-card aura-card aura-border-glow">
          <h2 className="checkout-section-title">Método de envío</h2>

          <div
            className={`option-box ${
              shippingMethod === "standard" ? "selected" : ""
            }`}
            onClick={() => setShippingMethod("standard")}
          >
            <div className="option-icon">🚚</div>
            <div>
              <strong>Envío estándar</strong>{" "}
              {formatPrice(total > 100 ? 0 : 6.99)}
              <p className="shipping-desc">Entrega en 48/72h</p>
            </div>
          </div>

          <div
            className={`option-box ${
              shippingMethod === "express" ? "selected" : ""
            }`}
            onClick={() => setShippingMethod("express")}
          >
            <div className="option-icon">⚡</div>
            <div>
              <strong>Envío express</strong>
              {formatPrice(total > 100 ? 4.99 : 9.99)}
              <p className="shipping-desc">Entrega en 24h</p>
            </div>
          </div>
        </div>

        {/* MÉTODO DE PAGO */}
        <div className="checkout-card aura-card aura-border-glow">
          <h2 className="checkout-section-title">Método de pago</h2>

          <div
            className={`option-box ${
              paymentMethod === "card" ? "selected" : ""
            }`}
            onClick={() => setPaymentMethod("card")}
          >
            <div className="payment-box">
              <span>Tarjeta (Visa/Mastercard)</span>
              <img src="/images/payments/cards.png" className="payment-icon" />
            </div>
          </div>

          <div
            className={`option-box ${
              paymentMethod === "paypal" ? "selected" : ""
            }`}
            onClick={() => setPaymentMethod("paypal")}
          >
            <div className="payment-box">
              <span>PayPal</span>
              <img src="/images/payments/paypal.png" className="payment-icon" />
            </div>
          </div>

          <div
            className={`option-box ${
              paymentMethod === "bizum" ? "selected" : ""
            }`}
            onClick={() => setPaymentMethod("bizum")}
          >
            <div className="payment-box">
              <span>Bizum</span>
              <img src="/images/payments/bizum.png" className="payment-icon" />
            </div>
          </div>
        </div>

        {/* RESUMEN */}
        <aside className="checkout-summary aura-card aura-border-glow">
          <h2 className="checkout-section-title">Resumen del pedido</h2>

          <div className="checkout-summary-items">
            {cart.map((item) => (
              <div key={item.id} className="summary-item">
                <span>
                  {item.name} × {item.quantity}
                </span>
                <strong>{formatPrice(item.price * item.quantity)}</strong>
              </div>
            ))}
          </div>

          {/* CUPÓN */}
          <div className="coupon-box">
            <input
              type="text"
              placeholder="Cupón descuento"
              value={coupon}
              onChange={(e) => setCoupon(e.target.value)}
            />
            <button type="button" onClick={applyCoupon}>
              Aplicar
            </button>
          </div>

          {couponError && <p className="coupon-error">{couponError}</p>}

          {couponApplied && (
            <p className="coupon-success">
              Cupón <strong>{couponApplied.code}</strong> aplicado ✔
            </p>
          )}

          <hr className="checkout-divider" />

          <div className="summary-row">
            <span>Subtotal</span>
            <span>{formatPrice(total)}</span>
          </div>

          <div className="summary-row">
            <span>Envío</span>
            <span>
              {shippingCost === 0 ? "Gratis" : formatPrice(shippingCost)}
            </span>
          </div>

          {discount > 0 && (
            <div className="summary-row">
              <span>Descuento</span>
              <strong>-{formatPrice(discount)}</strong>
            </div>
          )}

          <div className="summary-total">
            <span>Total</span>
            <strong>{formatPrice(grandTotal)}</strong>
          </div>

          <button
            type="button"
            onClick={submitOrder}
            className="aura-btn-glass-neon checkout-submit"
          >
            <span>Confirmar pedido</span>
          </button>
        </aside>
      </form>
    </section>
  );
}
const submitOrder = async () => {
  try {
    const orderPayload = {
      userId: 1, // cambialo cuando tengas login real
      items: cart.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
      })),
      couponCode: couponApplied?.code || null,
    };

    const res = await fetch("http://localhost:8080/api/orders/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderPayload),
    });

    if (!res.ok) {
      alert("Error al crear el pedido");
      return;
    }

    const createdOrder = await res.json();

    // Limpia carrito
    localStorage.setItem("cart", "[]");

    // Redirige al detalle del pedido real
    window.location.href = `/orders/${createdOrder.id}`;
  } catch (error) {
    console.error("Error creando pedido:", error);
    alert("Hubo un error al procesar el pedido");
  }
};
