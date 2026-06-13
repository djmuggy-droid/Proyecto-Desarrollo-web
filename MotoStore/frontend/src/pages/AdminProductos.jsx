import React, { useEffect, useState } from 'react';
import api from '../api/axios.js';

const inicial = { nombre: '', descripcion: '', marca: '', modelo_compatible: '', precio: '', stock: '', imagen_url: '', id_categoria: 1 };

export default function AdminProductos() {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [form, setForm] = useState(inicial);
  const [edit, setEdit] = useState(null);
  const [msg, setMsg] = useState('');

  const cargar = () => {
    api.get('/productos').then(r => setProductos(r.data));
    api.get('/categorias').then(r => setCategorias(r.data));
  };

  useEffect(() => { cargar(); }, []);

  const guardar = async (e) => {
    e.preventDefault();
    if (edit) {
      await api.put(`/productos/${edit}`, form);
      setMsg('Producto actualizado correctamente');
    } else {
      await api.post('/productos', form);
      setMsg('Producto creado correctamente');
    }
    setForm(inicial);
    setEdit(null);
    cargar();
  };

  const editar = (p) => {
    setEdit(p.id_producto);
    setForm({
      nombre: p.nombre || '', descripcion: p.descripcion || '', marca: p.marca || '',
      modelo_compatible: p.modelo_compatible || '', precio: p.precio || '', stock: p.stock || '',
      imagen_url: p.imagen_url || '', id_categoria: p.id_categoria || 1
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const desactivar = async (id) => {
    await api.put(`/productos/desactivar/${id}`);
    setMsg('Producto desactivado con soft delete');
    cargar();
  };

  return (
    <main className="container adminPage">
      <section className="adminHero">
        <div>
          <span className="pill">Panel protegido</span>
          <h2>Administración de inventario MotoStore</h2>
          <p>Esta sección solo aparece para usuarios con rol admin. Aquí se crea, edita y desactiva inventario sin borrar físicamente registros.</p>
        </div>
        <div className="adminMetric"><b>{productos.length}</b><span>productos activos</span></div>
      </section>

      <form className="adminForm proForm" onSubmit={guardar}>
        <input required placeholder="Nombre del producto" value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })} />
        <input required placeholder="Marca" value={form.marca} onChange={e => setForm({ ...form, marca: e.target.value })} />
        <input required placeholder="Modelo compatible" value={form.modelo_compatible} onChange={e => setForm({ ...form, modelo_compatible: e.target.value })} />
        <input required type="number" step="0.01" placeholder="Precio" value={form.precio} onChange={e => setForm({ ...form, precio: e.target.value })} />
        <input required type="number" placeholder="Stock" value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })} />
        <input placeholder="URL de imagen" value={form.imagen_url} onChange={e => setForm({ ...form, imagen_url: e.target.value })} />
        <select value={form.id_categoria} onChange={e => setForm({ ...form, id_categoria: e.target.value })}>
          {categorias.map(c => <option key={c.id_categoria} value={c.id_categoria}>{c.nombre}</option>)}
        </select>
        <textarea placeholder="Descripción" value={form.descripcion} onChange={e => setForm({ ...form, descripcion: e.target.value })} />
        <button className="btn">{edit ? 'Actualizar producto' : 'Crear producto'}</button>
        {edit && <button className="btn secondary" type="button" onClick={() => { setEdit(null); setForm(inicial); }}>Cancelar edición</button>}
      </form>

      {msg && <p className="ok">{msg}</p>}

      <section className="adminGrid">
        {productos.map(p => (
          <article className="adminProduct" key={p.id_producto}>
            <img src={p.imagen_url} alt={p.nombre} />
            <div>
              <span className="categoryTag">{p.categoria}</span>
              <h3>{p.nombre}</h3>
              <p>{p.marca} · {p.modelo_compatible}</p>
              <b>${Number(p.precio).toFixed(2)} · Stock {p.stock}</b>
              <div className="adminActions">
                <button onClick={() => editar(p)}>Editar</button>
                <button onClick={() => desactivar(p.id_producto)}>Desactivar</button>
              </div>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
