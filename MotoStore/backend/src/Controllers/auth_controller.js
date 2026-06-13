const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const connection = require('../bd/connection');

const registrarUsuario = async (req, res) => {
  try {
    const { nombre, correo, password, telefono, direccion } = req.body;
    if (!nombre || !correo || !password) return res.status(400).json({ mensaje: 'Nombre, correo y contraseña son obligatorios' });

    connection.query('SELECT id_usuario FROM usuarios WHERE correo = ?', [correo], async (error, resultados) => {
      if (error) return res.status(500).json({ mensaje: 'Error al verificar correo', error });
      if (resultados.length > 0) return res.status(400).json({ mensaje: 'El correo ya está registrado' });

      const passwordEncriptado = await bcrypt.hash(password, 10);
      const sql = 'INSERT INTO usuarios (nombre, correo, password, telefono, direccion, rol, estado_activo) VALUES (?, ?, ?, ?, ?, ?, TRUE)';
      connection.query(sql, [nombre, correo, passwordEncriptado, telefono || '', direccion || '', 'user'], (error, resultado) => {
        if (error) return res.status(500).json({ mensaje: 'Error al registrar usuario', error });
        res.status(201).json({ mensaje: 'Usuario registrado correctamente', id_usuario: resultado.insertId });
      });
    });
  } catch (error) { res.status(500).json({ mensaje: 'Error interno', error }); }
};

const iniciarSesion = (req, res) => {
  const { correo, password } = req.body;
  if (!correo || !password) return res.status(400).json({ mensaje: 'Correo y contraseña son obligatorios' });

  connection.query('SELECT * FROM usuarios WHERE correo = ? AND estado_activo = TRUE', [correo], async (error, resultados) => {
    if (error) return res.status(500).json({ mensaje: 'Error al iniciar sesión', error });
    if (resultados.length === 0) return res.status(401).json({ mensaje: 'Correo o contraseña incorrectos' });

    const usuario = resultados[0];
    const passwordCorrecto = await bcrypt.compare(password, usuario.password);
    if (!passwordCorrecto) return res.status(401).json({ mensaje: 'Correo o contraseña incorrectos' });

    const token = jwt.sign({ id_usuario: usuario.id_usuario, correo: usuario.correo, rol: usuario.rol }, process.env.JWT_SECRET, { expiresIn: '2h' });
    res.json({ mensaje: 'Inicio de sesión correcto', token, usuario: { id_usuario: usuario.id_usuario, nombre: usuario.nombre, correo: usuario.correo, telefono: usuario.telefono, direccion: usuario.direccion, rol: usuario.rol } });
  });
};

module.exports = { registrarUsuario, iniciarSesion };
