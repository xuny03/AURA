import { useEffect, useState } from "react";
import CartIcon from "./cart/CartIcon.jsx";
import { isAdmin, isAuth, getUser, logout } from "./auth/auth";

export default function Navbar({ currentPath = "/" }) {
  const hideCart = currentPath.startsWith("/cart");

  const [logged, setLogged] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    setLogged(isAuth());
    setUser(getUser());
  }, []);

  const handleLogout = () => {
    logout();
    window.location.href = "/";
  };

  return (
    <nav className="navbar navbar-expand-lg fixed-top aura-navbar">
      <div className="container">
        {/* LOGO ------------------------------------------------ */}
        <a className="navbar-brand d-flex align-items-center gap-2" href="/">
          <span className="aura-navbar-accent">●</span>
          <span className="aura-navbar-brand">Aura Build Picker</span>
        </a>

        {/* RIGHT ZONE ---------------------------------------- */}
        <div className="d-flex align-items-center gap-3 order-lg-2">
          {/* LOGIN / USER BUTTON */}
          {!logged ? (
            <a href="/login" className="aura-btn-glass-neon">
              <span>LOGIN</span>
            </a>
          ) : (
            <div className="d-flex align-items-center gap-2">
              <span
                className="text-light small"
                style={{
                  textShadow: "0 0 8px rgba(168,85,247,.7)",
                  letterSpacing: ".05em",
                }}
              >
                {user?.username}
              </span>

              <button onClick={handleLogout} className="aura-btn-neon">
                <span>SALIR</span>
              </button>
            </div>
          )}

          {/* CART ICON ------------------------------------- */}
          {!hideCart && (
            <div className="cart-wrapper-desktop-mobile">
              <CartIcon />
            </div>
          )}

          {/* BURGER --------------------------------------- */}
          <button
            className="navbar-toggler aura-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#mainNavbar"
            aria-controls="mainNavbar"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="aura-bars"></span>
            <span className="aura-bars"></span>
            <span className="aura-bars"></span>
          </button>
        </div>

        {/* MENU -------------------------------------------- */}
        <div className="collapse navbar-collapse order-lg-1" id="mainNavbar">
          <ul className="navbar-nav ms-lg-auto mb-2 mb-lg-0 gap-lg-3 navbar-menu-pc">
            <li className="nav-item">
              <a className="nav-link" href="/">
                Inicio
              </a>
            </li>

            <li className="nav-item">
              <a className="nav-link" href="/products">
                Productos
              </a>
            </li>
            {isAdmin() && (
              <li className="nav-item">
                <a className="nav-link" href="/orders">
                  Pedidos
                </a>
              </li>
            )}

            <li className="nav-item">
              <a className="nav-link" href="/users">
                Usuario
              </a>
            </li>

            {!hideCart && (
              <li className="nav-item d-none d-lg-flex cart-inline-desktop">
                <CartIcon />
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
