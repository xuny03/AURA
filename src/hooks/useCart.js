import { getCartKey } from "../components/auth/cartKey";

export default function useCart() {

  const getCart = () => {
    const saved = localStorage.getItem(getCartKey());
    return saved ? JSON.parse(saved) : [];
  };

  const saveCart = (cart) => {
    localStorage.setItem(getCartKey(), JSON.stringify(cart));
    window.dispatchEvent(new CustomEvent(
      "cart-updated",
      { detail: cart }
    ));
  };

  const addToCart = (product) => {
    const cart = getCart();

    const existing = cart.find(i => i.id === product.id);

    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({
        ...product,
        quantity: 1,
      });
    }

    saveCart(cart);
  };

  return {
    addToCart,
    getCart,
    saveCart
  };
}
