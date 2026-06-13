import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios.js';

export default function Login({ onLogin }) {
  const [form, setForm] = useState({ correo: '', password: '' });
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);
  const navigate = useNavigate();

  const enviar = async (e) => {
    e.preventDefault();
    setError('');
    setCargando(true);

    try {
      const r = await api.post('/auth/login', form);
      localStorage.setItem('token', r.data.token);
      localStorage.setItem('usuario', JSON.stringify(r.data.usuario));
      onLogin?.(r.data.usuario);

      if (r.data.usuario.rol === 'admin') {
        navigate('/admin/productos');
      } else {
        navigate('/productos');
      }
    } catch (err) {
      setError(err.response?.data?.mensaje || 'Correo o contraseña incorrectos');
    } finally {
      setCargando(false);
    }
  };

  return (
    <main className="formPage loginScene">
      <form className="form glassForm" onSubmit={enviar}>
        <span className="pill">Acceso seguro con bcrypt</span>
        <h2>Iniciar sesión</h2>
        <p className="formHint">Ingresa para comprar o administrar el inventario.</p>
        <input placeholder="Correo" value={form.correo} onChange={e => setForm({ ...form, correo: e.target.value })} />
        <input type="password" placeholder="Contraseña" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
        <button className="btn" disabled={cargando}>{cargando ? 'Validando...' : 'Ingresar'}</button>
        {error && <p className="error">{error}</p>}
        <p>¿No tienes cuenta? <Link to="/register">Regístrate</Link></p>
      </form>
    </main>
  );
}
