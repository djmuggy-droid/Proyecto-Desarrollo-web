import React, { useEffect, useState } from 'react';
import api from '../api/axios.js';

export default function Pedidos() {
  const [pedidos, setPedidos] = useState([]);
  useEffect(() => { api.get('/pedidos/mis-pedidos').then(r => setPedidos(r.data)); }, []);

  return (
    <main className="container ordersPage">
      <span className="pill dark">Historial</span>
      <h2>Mis pedidos</h2>
      {pedidos.length === 0 ? <p>No tienes pedidos todavía.</p> : pedidos.map(p => (
        <div className="pedido" key={p.id_pedido}>
          <b>Pedido #{p.id_pedido}</b>
          <p>Total: ${Number(p.total).toFixed(2)} · Estado: {p.estado}</p>
          <small>{new Date(p.fecha_pedido).toLocaleString()}</small>
        </div>
      ))}
    </main>
  );
}
