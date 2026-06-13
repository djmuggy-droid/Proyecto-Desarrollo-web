import React, { useEffect, useState } from 'react';
import { Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom';
import api from './api/axios.js';
import Home from './pages/Home.jsx';
import Productos from './pages/Productos.jsx';
import DetalleProducto from './pages/DetalleProducto.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Carrito from './pages/Carrito.jsx';
import AdminProductos from './pages/AdminProductos.jsx';
import Pedidos from './pages/Pedidos.jsx';

function App() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(JSON.parse(localStorage.getItem('usuario') || 'null'));
  const [cartCount, setCartCount] = useState(0);

  const cargarContadorCarrito = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setCartCount(0);
      return;
    }

    try {
      const res = await api.get('/carrito');
      const total = res.data.reduce((acc, item) => acc + Number(item.cantidad), 0);
      setCartCount(total);
    } catch {
      setCartCount(0);
    }
  };

  useEffect(() => {
    cargarContadorCarrito();
    const actualizar = () => cargarContadorCarrito();
    window.addEventListener('cart-updated', actualizar);
    window.addEventListener('storage', () => setUsuario(JSON.parse(localStorage.getItem('usuario') || 'null')));
    return () => window.removeEventListener('cart-updated', actualizar);
  }, []);

  const manejarLogin = (usuarioLogueado) => {
    setUsuario(usuarioLogueado);
    cargarContadorCarrito();
  };

  const logout = () => {
    localStorage.clear();
    setUsuario(null);
    setCartCount(0);
    navigate('/login');
  };

  return (
    <>
      <nav className="navbar">
        <Link className="logo" to="/">🏍️ MotoStore Ecuador</Link>
        <div className="navlinks">
          <Link to="/">Inicio</Link>
          <Link to="/productos">Catálogo</Link>
          {usuario && (
            <Link className="cartLink" to="/carrito">
              Carrito <span className="cartBadge">{cartCount}</span>
            </Link>
          )}
          {usuario && <Link to="/pedidos">Pedidos</Link>}
          {usuario?.rol === 'admin' && <Link className="adminLink" to="/admin/productos">Panel Admin</Link>}
          {!usuario ? (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Registro</Link>
            </>
          ) : (
            <button className="logoutBtn" onClick={logout}>Salir</button>
          )}
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/productos" element={<Productos onCartChange={cargarContadorCarrito} />} />
        <Route path="/productos/:id" element={<DetalleProducto onCartChange={cargarContadorCarrito} />} />
        <Route path="/login" element={<Login onLogin={manejarLogin} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/carrito" element={usuario ? <Carrito onCartChange={cargarContadorCarrito} /> : <Navigate to="/login" />} />
        <Route path="/pedidos" element={usuario ? <Pedidos /> : <Navigate to="/login" />} />
        <Route path="/admin/productos" element={usuario?.rol === 'admin' ? <AdminProductos /> : <Navigate to="/login" />} />
      </Routes>
    </>
  );
}

export default App;
