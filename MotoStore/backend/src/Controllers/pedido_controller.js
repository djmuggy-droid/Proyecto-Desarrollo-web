const connection = require('../bd/connection');

const crearPedido = (req, res) => {
  const id_usuario = req.usuario.id_usuario;
  const sqlCarrito = `SELECT c.*, p.precio, p.stock FROM carrito c INNER JOIN productos p ON c.id_producto = p.id_producto WHERE c.id_usuario=? AND c.estado_activo=TRUE AND p.estado_activo=TRUE`;
  connection.query(sqlCarrito, [id_usuario], (error, items) => {
    if (error) return res.status(500).json({ mensaje: 'Error al consultar carrito', error });
    if (items.length === 0) return res.status(400).json({ mensaje: 'El carrito está vacío' });
    const sinStock = items.find(item => item.cantidad > item.stock);
    if (sinStock) return res.status(400).json({ mensaje: 'No hay stock suficiente para un producto' });
    const total = items.reduce((acc, item) => acc + Number(item.precio) * item.cantidad, 0);

    connection.query('INSERT INTO pedidos (id_usuario, total, estado) VALUES (?, ?, ?)', [id_usuario, total, 'pagado'], (error, pedidoResult) => {
      if (error) return res.status(500).json({ mensaje: 'Error al crear pedido', error });
      const id_pedido = pedidoResult.insertId;
      const valores = items.map(item => [id_pedido, item.id_producto, item.cantidad, item.precio, item.cantidad * item.precio]);
      connection.query('INSERT INTO detalle_pedido (id_pedido, id_producto, cantidad, precio_unitario, subtotal) VALUES ?', [valores], (error) => {
        if (error) return res.status(500).json({ mensaje: 'Error al crear detalle', error });
        items.forEach(item => connection.query('UPDATE productos SET stock = stock - ? WHERE id_producto=?', [item.cantidad, item.id_producto]));
        connection.query('UPDATE carrito SET estado_activo=FALSE WHERE id_usuario=?', [id_usuario]);
        res.status(201).json({ mensaje: 'Pedido creado correctamente', id_pedido, total });
      });
    });
  });
};

const listarMisPedidos = (req, res) => {
  connection.query('SELECT * FROM pedidos WHERE id_usuario=? ORDER BY fecha_pedido DESC', [req.usuario.id_usuario], (error, results) => {
    if (error) return res.status(500).json({ mensaje: 'Error al listar pedidos', error });
    res.json(results);
  });
};

const listarPedidosAdmin = (req, res) => {
  const sql = `SELECT p.*, u.nombre AS cliente, u.correo FROM pedidos p INNER JOIN usuarios u ON p.id_usuario = u.id_usuario ORDER BY p.fecha_pedido DESC`;
  connection.query(sql, (error, results) => {
    if (error) return res.status(500).json({ mensaje: 'Error al listar pedidos', error });
    res.json(results);
  });
};

const cambiarEstadoPedido = (req, res) => {
  connection.query('UPDATE pedidos SET estado=? WHERE id_pedido=?', [req.body.estado, req.params.id], (error) => {
    if (error) return res.status(500).json({ mensaje: 'Error al cambiar estado', error });
    res.json({ mensaje: 'Estado actualizado' });
  });
};

module.exports = { crearPedido, listarMisPedidos, listarPedidosAdmin, cambiarEstadoPedido };
