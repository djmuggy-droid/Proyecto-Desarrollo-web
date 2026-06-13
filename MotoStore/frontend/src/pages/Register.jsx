import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios.js';

export default function Register() {
  const [form, setForm] = useState({ nombre: '', correo: '', password: '', telefono: '', direccion: '' });
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const enviar = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/auth/register', form);
      setMsg('Usuario registrado correctamente');
      setTimeout(() => navigate('/login'), 900);
    } catch (err) {
      setError(err.response?.data?.mensaje || 'No se pudo registrar');
    }
  };

  return (
    <main className="formPage registerScene">
      <form className="form glassForm" onSubmit={enviar}>
        <span className="pill">Nueva cuenta</span>
        <h2>Crear cuenta</h2>
        {['nombre', 'correo', 'password', 'telefono', 'direccion'].map(c => (
          <input key={c} type={c === 'password' ? 'password' : 'text'} placeholder={c} value={form[c]} onChange={e => setForm({ ...form, [c]: e.target.value })} />
        ))}
        <button className="btn">Registrarme</button>
        {msg && <p className="ok">{msg}</p>}
        {error && <p className="error">{error}</p>}
        <p>¿Ya tienes cuenta? <Link to="/login">Ingresa</Link></p>
      </form>
    </main>
  );
}
