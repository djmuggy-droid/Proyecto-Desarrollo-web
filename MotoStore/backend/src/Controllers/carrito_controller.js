const connection = require('../bd/connection');

const listarCarrito = (req, res) => {
  const id_usuario = req.usuario.id_usuario;
  const sql = `SELECT c.id_carrito, c.cantidad, p.id_producto, p.nombre, p.precio, p.imagen_url, (c.cantidad * p.precio) AS subtotal FROM carrito c INNER JOIN productos p ON c.id_producto = p.id_producto WHERE c.id_usuario = ? AND c.estado_activo = TRUE AND p.estado_activo = TRUE`;
  connection.query(sql, [id_usuario], (error, results) => {
    if (error) return res.status(500).json({ mensaje: 'Error al listar carrito', error });
    res.json(results);
  });
};

const agregarCarrito = (req, res) => {
  const id_usuario = req.usuario.id_usuario;
  const { id_producto, cantidad } = req.body;
  const buscar = 'SELECT * FROM carrito WHERE id_usuario=? AND id_producto=? AND estado_activo=TRUE';
  connection.query(buscar, [id_usuario, id_producto], (error, results) => {
    if (error) return res.status(500).json({ mensaje: 'Error al revisar carrito', error });
    if (results.length > 0) {
      connection.query('UPDATE carrito SET cantidad = cantidad + ? WHERE id_carrito=?', [cantidad || 1, results[0].id_carrito], (error) => {
        if (error) return res.status(500).json({ mensaje: 'Error al actualizar carrito', error });
        res.json({ mensaje: 'Producto agregado al carrito' });
      });
    } else {
      connection.query('INSERT INTO carrito (id_usuario, id_producto, cantidad) VALUES (?, ?, ?)', [id_usuario, id_producto, cantidad || 1], (error) => {
        if (error) return res.status(500).json({ mensaje: 'Error al agregar al carrito', error });
        res.status(201).json({ mensaje: 'Producto agregado al carrito' });
      });
    }
  });
};

const actualizarCantidad = (req, res) => {
  const { cantidad } = req.body;
  connection.query('UPDATE carrito SET cantidad=? WHERE id_carrito=? AND id_usuario=?', [cantidad, req.params.id, req.usuario.id_usuario], (error) => {
    if (error) return res.status(500).json({ mensaje: 'Error al actualizar cantidad', error });
    res.json({ mensaje: 'Cantidad actualizada' });
  });
};

const quitarCarrito = (req, res) => {
  connection.query('UPDATE carrito SET estado_activo = FALSE WHERE id_carrito=? AND id_usuario=?', [req.params.id, req.usuario.id_usuario], (error) => {
    if (error) return res.status(500).json({ mensaje: 'Error al quitar producto', error });
    res.json({ mensaje: 'Producto quitado del carrito' });
  });
};

module.exports = { listarCarrito, agregarCarrito, actualizarCantidad, quitarCarrito };
