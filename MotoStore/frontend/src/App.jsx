import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

import Home from "./pages/Home";
import Productos from "./pages/Productos";
import DetalleProducto from "./pages/DetalleProducto";
import Carrito from "./pages/Carrito";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Pedidos from "./pages/Pedidos";
import AdminProductos from "./pages/AdminProductos";
import ProtectedAdminRoute from "./components/ProtectedAdminRoute";

function App() {
  const usuarioGuardado = localStorage.getItem("usuario");
  const usuario = usuarioGuardado ? JSON.parse(usuarioGuardado) : null;

  const cerrarSesion = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    window.location.href = "/";
  };

  return (
    <BrowserRouter>
      <nav className="navbar">
        <Link className="logo" to="/">
          🏍️ MotoStore Ecuador
        </Link>

        <div className="nav-links">
          <Link to="/">Inicio</Link>
          <Link to="/productos">Catálogo</Link>
          <Link to="/carrito">Carrito</Link>

          {usuario && (
            <Link to="/pedidos">Pedidos</Link>
          )}

          {usuario?.rol === "admin" && (
            <Link to="/admin/productos" className="admin-link">
              Panel Admin
            </Link>
          )}

          {!usuario && (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Registro</Link>
            </>
          )}

          {usuario && (
            <button className="logout-btn" onClick={cerrarSesion}>
              Salir
            </button>
          )}
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/productos" element={<Productos />} />
        <Route path="/productos/:id" element={<DetalleProducto />} />
        <Route path="/carrito" element={<Carrito />} />
        <Route path="/pedidos" element={<Pedidos />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/admin/productos"
          element={
            <ProtectedAdminRoute>
              <AdminProductos />
            </ProtectedAdminRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
