export function getCartKey() {
  if (typeof window === "undefined") return "cart";

  const user = JSON.parse(localStorage.getItem("user") || "null");

  if (user?.id) return `cart_${user.id}`;

  return "cart_guest";
}
