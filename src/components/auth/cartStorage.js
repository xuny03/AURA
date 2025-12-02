import { getUser } from "./auth";

const getCartKey = () => {
  const user = getUser();
  return user ? `cart_${user.id}` : "cart_guest";
};


// ---------------------------
// GET CART
// ---------------------------
export const getCart = () => {

  if (typeof window === "undefined") return [];

  const key = getCartKey();

  try {
    return JSON.parse(localStorage.getItem(key)) || [];
  }
  catch {
    return [];
  }
};


// ---------------------------
// SAVE CART
// ---------------------------
export const saveCart = (cart) => {

  if (typeof window === "undefined") return;

  const key = getCartKey();

  localStorage.setItem(key, JSON.stringify(cart));
};


// ---------------------------
// CLEAR CART
// ---------------------------
export const clearCart = () => {

  if (typeof window === "undefined") return;

  const key = getCartKey();

  localStorage.removeItem(key);
};
