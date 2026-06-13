import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios.js';

export default function DetalleProducto({ onCartChange }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [producto, setProducto] = useState(null);
  const [cantidad, setCantidad] = useState(1);
  const [msg, setMsg] = useState('');
  const usuario = JSON.parse(localStorage.getItem('usuario') || 'null');

  useEffect(() => { api.get(`/productos/${id}`).then(r => setProducto(r.data)); }, [id]);

  const agregar = async () => {
    if (!usuario) return navigate('/login');
    await api.post('/carrito', { id_producto: producto.id_producto, cantidad });
    setMsg('Producto agregado al carrito');
    onCartChange?.();
    window.dispatchEvent(new Event('cart-updated'));
  };

  if (!producto) return <p className="msg">Cargando detalle...</p>;

  return (
    <main className="detail detailPro">
      <div className="detailImage"><img src={producto.imagen_url} alt={producto.nombre} /></div>
      <div className="detailInfo">
        <span className="pill dark">{producto.categoria}</span>
        <h2>{producto.nombre}</h2>
        <p>{producto.descripcion}</p>
        <div className="specs">
          <span><b>Marca</b>{producto.marca}</span>
          <span><b>Compatible</b>{producto.modelo_compatible}</span>
          <span><b>Stock</b>{producto.stock}</span>
        </div>
        <h3>${Number(producto.precio).toFixed(2)}</h3>
        <div className="qtyBox">
          <button onClick={() => setCantidad(Math.max(1, cantidad - 1))}>-</button>
          <strong>{cantidad}</strong>
          <button onClick={() => setCantidad(cantidad + 1)}>+</button>
        </div>
        <button className="btn" onClick={agregar}>Agregar al carrito</button>
        {msg && <p className="ok">{msg}</p>}
      </div>
    </main>
  );
}
