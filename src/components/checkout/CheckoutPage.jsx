import React, { useEffect, useState, useMemo } from "react";
import { getCart, clearCart } from "../auth/cartStorage";

const formatPrice = (value) =>
  new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
  }).format(value || 0);

export default function CheckoutPage() {
  const [cart, setCart] = useState([]);

  const [shippingMethod, setShippingMethod] = useState("standard");
  const [paymentMethod, setPaymentMethod] = useState("card");

  const [coupon, setCoupon] = useState("");
  const [couponApplied, setCouponApplied] = useState(null);
  const [couponError, setCouponError] = useState("");

  // ---------------------------------
  // CARGAR CARRITO
  // ---------------------------------
  useEffect(() => {
    setCart(getCart());
  }, []);

  // ---------------------------------
  // SUBTOTAL
  // ---------------------------------
  const total = useMemo(
    () => cart.reduce((acc, item) => acc + item.price * item.quantity, 0),
    [cart]
  );

  // ---------------------------------
  // CUPÓN
  // ---------------------------------
  const applyCoupon = async () => {
    const code = coupon.trim();
    if (!code) {
      setCouponError("Introduce un cupón");
      return;
    }

    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`http://localhost:8080/api/coupons/${code}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        setCouponError("Cupón no válido");
        setCouponApplied(null);
        return;
      }

      const data = await res.json();

      setCouponApplied({
        code: data.code,
        type: data.type.toUpperCase(),
        amount: data.value,
      });

      setCouponError("");
    } catch {
      setCouponError("Error al conectar con el servidor");
    }
  };

  // ---------------------------------
  // ENVÍO
  // ---------------------------------
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

  // ---------------------------------
  // DESCUENTO
  // ---------------------------------
  const discount = useMemo(() => {
    if (!couponApplied) return 0;

    if (couponApplied.type === "PERCENT")
      return (total * couponApplied.amount) / 100;

    if (couponApplied.type === "FLAT") return couponApplied.amount;

    return 0;
  }, [couponApplied, total]);

  const grandTotal = total + shippingCost - discount;

  // ---------------------------------
  // SUBMIT
  // ---------------------------------
  const submitOrder = async () => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Debes iniciar sesión");
      return;
    }

    const payload = {
      total: parseFloat(grandTotal.toFixed(2)),
      items: cart.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
        unitPrice: parseFloat(item.price.toFixed(2)),
      })),
      couponCode: couponApplied?.code ?? null,
      shippingMethod,
      paymentMethod,
    };

    console.log("PAYLOAD:", payload);

    const res = await fetch("http://localhost:8080/api/orders/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (res.status === 403) {
      alert("Acceso denegado");
      return;
    }

    if (!res.ok) {
      const msg = await res.text();
      console.error("Backend error:", msg);
      alert("Error al crear el pedido");
      return;
    }

    const created = await res.json();

    clearCart();
    window.dispatchEvent(new CustomEvent("cart-updated"));
    window.location.href = `/orders/${created.id}`;

  } catch (err) {
    console.error(err);
    alert("Error procesando pedido");
  }
};




  // ---------------------------------
  // RENDER COMPLTEO CON ESTILOS AURA
  // ---------------------------------
  return (
    <section className="checkout-page container py-4">
      <h1 className="checkout-title">Finalizar pedido</h1>
      <p className="checkout-subtitle">
        Completa tu información y revisa tu pedido
      </p>

      <form className="checkout-grid">
        {/* DATOS PERSONALES */}
        <div className="checkout-card aura-card aura-border-glow">
          <h2 className="checkout-section-title">Datos personales</h2>
          <label>
            Nombre <input type="text" />
          </label>
          <label>
            Email <input type="email" />
          </label>
          <label>
            Teléfono <input type="text" />
          </label>
        </div>

        {/* DIRECCIÓN */}
        <div className="checkout-card aura-card aura-border-glow">
          <h2 className="checkout-section-title">Dirección de envío</h2>
          <label>
            Dirección <input type="text" />
          </label>
          <label>
            Ciudad <input type="text" />
          </label>
          <label>
            Código postal <input type="text" />
          </label>
          <label>
            País <input type="text" />
          </label>
        </div>

        {/* ENVÍO */}
        <div className="checkout-card aura-card aura-border-glow">
          <h2 className="checkout-section-title">Método de envío</h2>

          <div
            className={`option-box ${
              shippingMethod === "standard" ? "selected" : ""
            }`}
            onClick={() => setShippingMethod("standard")}
          >
            <strong>Envío estándar</strong>
            <span>{formatPrice(total > 100 ? 0 : 6.99)}</span>
          </div>

          <div
            className={`option-box ${
              shippingMethod === "express" ? "selected" : ""
            }`}
            onClick={() => setShippingMethod("express")}
          >
            <strong>Envío express</strong>
            <span>{formatPrice(total > 100 ? 4.99 : 9.99)}</span>
          </div>
        </div>

        {/* PAGO */}
        <div className="checkout-card aura-card aura-border-glow">
          <h2 className="checkout-section-title">Método de pago</h2>

          <div
            className={`option-box ${
              paymentMethod === "card" ? "selected" : ""
            }`}
            onClick={() => setPaymentMethod("card")}
          >
            <span>Tarjeta</span>
          </div>

          <div
            className={`option-box ${
              paymentMethod === "paypal" ? "selected" : ""
            }`}
            onClick={() => setPaymentMethod("paypal")}
          >
            <span>PayPal</span>
          </div>

          <div
            className={`option-box ${
              paymentMethod === "bizum" ? "selected" : ""
            }`}
            onClick={() => setPaymentMethod("bizum")}
          >
            <span>Bizum</span>
          </div>
        </div>

        {/* RESUMEN */}
        <aside className="checkout-summary aura-card aura-border-glow">
          <h2 className="checkout-section-title">Resumen</h2>

          {cart.map((item) => (
            <div key={item.id} className="summary-item">
              <span>
                {item.name} × {item.quantity}
              </span>
              <strong>{formatPrice(item.price * item.quantity)}</strong>
            </div>
          ))}

          <div className="coupon-box">
            <input
              value={coupon}
              onChange={(e) => setCoupon(e.target.value)}
              placeholder="Cupón"
            />
            <button type="button" onClick={applyCoupon}>
              Aplicar
            </button>
          </div>

          {couponError && <p className="coupon-error">{couponError}</p>}
          {couponApplied && <p className="coupon-success">Cupón aplicado</p>}

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
