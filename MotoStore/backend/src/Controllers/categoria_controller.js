const connection = require('../bd/connection');

const listarCategorias = (req, res) => {
  connection.query('SELECT * FROM categorias WHERE estado_activo = TRUE', (error, results) => {
    if (error) return res.status(500).json({ mensaje: 'Error al listar categorías', error });
    res.json(results);
  });
};

const crearCategoria = (req, res) => {
  const { nombre, descripcion } = req.body;
  connection.query('INSERT INTO categorias (nombre, descripcion) VALUES (?, ?)', [nombre, descripcion], (error, result) => {
    if (error) return res.status(500).json({ mensaje: 'Error al crear categoría', error });
    res.status(201).json({ mensaje: 'Categoría creada', id_categoria: result.insertId });
  });
};

const actualizarCategoria = (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion } = req.body;
  connection.query('UPDATE categorias SET nombre=?, descripcion=? WHERE id_categoria=?', [nombre, descripcion, id], (error) => {
    if (error) return res.status(500).json({ mensaje: 'Error al actualizar categoría', error });
    res.json({ mensaje: 'Categoría actualizada' });
  });
};

const desactivarCategoria = (req, res) => {
  connection.query('UPDATE categorias SET estado_activo = FALSE WHERE id_categoria=?', [req.params.id], (error) => {
    if (error) return res.status(500).json({ mensaje: 'Error al desactivar categoría', error });
    res.json({ mensaje: 'Categoría desactivada correctamente' });
  });
};

module.exports = { listarCategorias, crearCategoria, actualizarCategoria, desactivarCategoria };
