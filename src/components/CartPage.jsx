import useCart from "../hooks/useCart";

export default function CartPage() {
  const { cart, removeFromCart, clearCart } = useCart();

  return (
    <div className="aura-card p-4">
      <h2 className="mb-3">Tu Carrito</h2>

      {cart.length === 0 && <p>No hay productos en tu carrito.</p>}

      {cart.map((item) => (
        <div key={item.id} className="border-bottom pb-2 mb-2">
          <strong>{item.name}</strong>
          <p className="text-secondary small">{item.category}</p>
          <button
            className="btn btn-sm btn-outline-danger"
            onClick={() => removeFromCart(item.id)}
          >
            Quitar
          </button>
        </div>
      ))}

      {cart.length > 0 && (
        <button className="btn btn-danger mt-3" onClick={clearCart}>
          Vaciar carrito
        </button>
      )}
    </div>
  );
}
