import { CartProvider } from "../context/CartContext.jsx";
import CartBubble from "./CartBubble.jsx";

export default function ReactApp({ children }) {
  return (
    <CartProvider>
      {children}
      <CartBubble />
    </CartProvider>
  );
}
