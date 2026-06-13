import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios.js';

export default function Productos({ onCartChange }) {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [busqueda, setBusqueda] = useState('');
  const [categoria, setCategoria] = useState('Todas');
  const [toast, setToast] = useState('');
  const navigate = useNavigate();
  const usuario = JSON.parse(localStorage.getItem('usuario') || 'null');

  useEffect(() => {
    api.get('/productos')
      .then(r => setProductos(r.data))
      .catch(() => setError('No se pudieron cargar los productos'))
      .finally(() => setCargando(false));
  }, []);

  const agregar = async (producto) => {
    if (!usuario) return navigate('/login');
    await api.post('/carrito', { id_producto: producto.id_producto, cantidad: 1 });
    setToast(`${producto.nombre} agregado al carrito`);
    onCartChange?.();
    window.dispatchEvent(new Event('cart-updated'));
    setTimeout(() => setToast(''), 1800);
  };

  const categorias = ['Todas', ...new Set(productos.map(p => p.categoria))];
  const filtrados = productos.filter(p => {
    const texto = `${p.nombre} ${p.marca} ${p.modelo_compatible} ${p.categoria}`.toLowerCase();
    const coincideTexto = texto.includes(busqueda.toLowerCase());
    const coincideCategoria = categoria === 'Todas' || p.categoria === categoria;
    return coincideTexto && coincideCategoria;
  });

  if (cargando) return <p className="msg">Cargando productos...</p>;
  if (error) return <p className="error centerText">{error}</p>;

  return (
    <main className="container catalogPage">
      {toast && <div className="toast">{toast}</div>}
      <section className="catalogHeader">
        <div>
          <span className="pill dark">Catálogo inteligente</span>
          <h2>Productos para motos y accesorios</h2>
          <p>Filtra por categoría, revisa compatibilidad y agrega al carrito.</p>
        </div>
        <div className="catalogControls">
          <input placeholder="Buscar producto, marca o modelo..." value={busqueda} onChange={e => setBusqueda(e.target.value)} />
          <select value={categoria} onChange={e => setCategoria(e.target.value)}>
            {categorias.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
      </section>

      <section className="grid productGrid">
        {filtrados.map(p => (
          <article className="card productCard" key={p.id_producto}>
            <div className="imgWrap">
              <img src={p.imagen_url} alt={p.nombre} onError={e => { e.currentTarget.src = 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?q=80&w=900'; }} />
              <span className="categoryTag">{p.categoria}</span>
            </div>
            <div className="cardBody">
              <h3>{p.nombre}</h3>
              <p>{p.marca} · Compatible: {p.modelo_compatible}</p>
              <div className="priceRow"><b>${Number(p.precio).toFixed(2)}</b><span>Stock {p.stock}</span></div>
              <div className="cardActions">
                <Link className="btn small secondary" to={`/productos/${p.id_producto}`}>Detalle</Link>
                <button className="btn small" onClick={() => agregar(p)}>Agregar</button>
              </div>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
