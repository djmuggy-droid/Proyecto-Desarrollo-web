import React, { useEffect, useState } from 'react';
import api from '../api/axios.js';

export default function Carrito({ onCartChange }) {
  const [items, setItems] = useState([]);
  const [msg, setMsg] = useState('');
  const [cargando, setCargando] = useState(true);

  const cargar = () => api.get('/carrito').then(r => setItems(r.data)).finally(() => setCargando(false));
  useEffect(() => { cargar(); }, []);

  const actualizar = async (id, cantidad) => {
    if (cantidad <= 0) return quitar(id);
    await api.put(`/carrito/${id}`, { cantidad });
    await cargar();
    onCartChange?.();
    window.dispatchEvent(new Event('cart-updated'));
  };

  const quitar = async (id) => {
    await api.put(`/carrito/quitar/${id}`);
    await cargar();
    onCartChange?.();
    window.dispatchEvent(new Event('cart-updated'));
  };

  const comprar = async () => {
    try {
      const r = await api.post('/pedidos');
      setMsg(`Pedido creado correctamente. Total: $${Number(r.data.total).toFixed(2)}`);
      await cargar();
      onCartChange?.();
      window.dispatchEvent(new Event('cart-updated'));
    } catch (e) {
      setMsg(e.response?.data?.mensaje || 'Error al comprar');
    }
  };

  const total = items.reduce((a, i) => a + Number(i.subtotal), 0);
  const totalItems = items.reduce((a, i) => a + Number(i.cantidad), 0);

  if (cargando) return <p className="msg">Cargando carrito...</p>;

  return (
    <main className="container cartPage">
      <section className="cartHeader">
        <div>
          <span className="pill dark">Carrito de compras</span>
          <h2>Tu selección para la moto</h2>
          <p>{totalItems} producto(s) agregados</p>
        </div>
      </section>

      {items.length === 0 ? (
        <div className="emptyCart"><span>🛒</span><h3>Tu carrito está vacío</h3><p>Agrega cascos, aceites, repuestos o accesorios desde el catálogo.</p></div>
      ) : (
        <div className="cartLayout">
          <section className="cartList">
            {items.map(i => (
              <div className="cartItem pro" key={i.id_carrito}>
                <img src={i.imagen_url} alt={i.nombre} />
                <div className="cartInfo">
                  <b>{i.nombre}</b>
                  <p>Precio unitario: ${(Number(i.subtotal) / Number(i.cantidad)).toFixed(2)}</p>
                  <div className="qtyBox mini">
                    <button onClick={() => actualizar(i.id_carrito, i.cantidad - 1)}>-</button>
                    <strong>{i.cantidad}</strong>
                    <button onClick={() => actualizar(i.id_carrito, i.cantidad + 1)}>+</button>
                  </div>
                </div>
                <div className="cartSubtotal">
                  <b>${Number(i.subtotal).toFixed(2)}</b>
                  <button onClick={() => quitar(i.id_carrito)}>Quitar</button>
                </div>
              </div>
            ))}
          </section>

          <aside className="summaryCard">
            <h3>Resumen</h3>
            <p><span>Productos</span><b>{totalItems}</b></p>
            <p><span>Subtotal</span><b>${total.toFixed(2)}</b></p>
            <p><span>Envío</span><b>$0.00</b></p>
            <hr />
            <p className="totalLine"><span>Total</span><b>${total.toFixed(2)}</b></p>
            <button className="btn full" onClick={comprar}>Finalizar compra</button>
            {msg && <p className="ok">{msg}</p>}
          </aside>
        </div>
      )}
    </main>
  );
}
