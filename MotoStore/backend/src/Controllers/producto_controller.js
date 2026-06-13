const connection = require('../bd/connection');

const listarProductos = (req, res) => {
  const sql = `SELECT p.*, c.nombre AS categoria FROM productos p INNER JOIN categorias c ON p.id_categoria = c.id_categoria WHERE p.estado_activo = TRUE ORDER BY p.id_producto DESC`;
  connection.query(sql, (error, results) => {
    if (error) return res.status(500).json({ mensaje: 'Error al listar productos', error });
    res.json(results);
  });
};

const obtenerProducto = (req, res) => {
  const sql = `SELECT p.*, c.nombre AS categoria FROM productos p INNER JOIN categorias c ON p.id_categoria = c.id_categoria WHERE p.id_producto = ? AND p.estado_activo = TRUE`;
  connection.query(sql, [req.params.id], (error, results) => {
    if (error) return res.status(500).json({ mensaje: 'Error al obtener producto', error });
    if (results.length === 0) return res.status(404).json({ mensaje: 'Producto no encontrado' });
    res.json(results[0]);
  });
};

const crearProducto = (req, res) => {
  const { nombre, descripcion, marca, modelo_compatible, precio, stock, imagen_url, id_categoria } = req.body;
  const sql = `INSERT INTO productos (nombre, descripcion, marca, modelo_compatible, precio, stock, imagen_url, id_categoria) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
  connection.query(sql, [nombre, descripcion, marca, modelo_compatible, precio, stock, imagen_url, id_categoria], (error, result) => {
    if (error) return res.status(500).json({ mensaje: 'Error al crear producto', error });
    res.status(201).json({ mensaje: 'Producto creado correctamente', id_producto: result.insertId });
  });
};

const actualizarProducto = (req, res) => {
  const { nombre, descripcion, marca, modelo_compatible, precio, stock, imagen_url, id_categoria } = req.body;
  const sql = `UPDATE productos SET nombre=?, descripcion=?, marca=?, modelo_compatible=?, precio=?, stock=?, imagen_url=?, id_categoria=? WHERE id_producto=?`;
  connection.query(sql, [nombre, descripcion, marca, modelo_compatible, precio, stock, imagen_url, id_categoria, req.params.id], (error) => {
    if (error) return res.status(500).json({ mensaje: 'Error al actualizar producto', error });
    res.json({ mensaje: 'Producto actualizado correctamente' });
  });
};

const desactivarProducto = (req, res) => {
  connection.query('UPDATE productos SET estado_activo = FALSE WHERE id_producto = ?', [req.params.id], (error) => {
    if (error) return res.status(500).json({ mensaje: 'Error al desactivar producto', error });
    res.json({ mensaje: 'Producto desactivado correctamente' });
  });
};

module.exports = { listarProductos, obtenerProducto, crearProducto, actualizarProducto, desactivarProducto };
