import { clearCart } from "./cartStorage";

export const getToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
};

export const saveAuth = (data) => {

  localStorage.setItem("token", data.token);

  localStorage.setItem(
    "user",
    JSON.stringify({
      id: data.id,
      username: data.username,
      email: data.email,
      role: data.role
    })
  );

  // Refrescar carrito al login
  window.dispatchEvent(new CustomEvent("cart-updated"));
};


export const getUser = () => {
  if (typeof window === "undefined") return null;

  try {
    return JSON.parse(localStorage.getItem("user"));
  } catch {
    return null;
  }
};

export const isAdmin = () => {
  const user = getUser();
  return user?.role === "ADMIN";
};

export const isAuth = () => {
  if (typeof window === "undefined") return false;
  return !!localStorage.getItem("token");
};


export const logout = () => {
  if (typeof window === "undefined") return;

  clearCart();   // limpieza del carrito ANTES de borrar sesión

  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

