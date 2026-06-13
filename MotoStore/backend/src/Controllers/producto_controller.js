const connection = require('../bd/connection');

/*
  LISTAR PRODUCTOS PARA CLIENTES
  Solo muestra productos activos en el catálogo público.
*/
const listarProductos = (req, res) => {
  const sql = `
    SELECT 
      p.*, 
      c.nombre AS categoria 
    FROM productos p
    INNER JOIN categorias c ON p.id_categoria = c.id_categoria
    WHERE p.estado_activo = TRUE
    ORDER BY p.id_producto DESC
  `;

  connection.query(sql, (error, results) => {
    if (error) {
      return res.status(500).json({
        mensaje: 'Error al listar productos',
        error
      });
    }

    res.json(results);
  });
};

/*
  LISTAR PRODUCTOS PARA ADMIN
  Muestra productos activos e inactivos para poder activar/desactivar.
*/
const listarProductosAdmin = (req, res) => {
  const sql = `
    SELECT 
      p.*, 
      c.nombre AS categoria 
    FROM productos p
    INNER JOIN categorias c ON p.id_categoria = c.id_categoria
    ORDER BY p.id_producto DESC
  `;

  connection.query(sql, (error, results) => {
    if (error) {
      return res.status(500).json({
        mensaje: 'Error al listar productos para administrador',
        error
      });
    }

    res.json(results);
  });
};

/*
  OBTENER PRODUCTO POR ID
  Para clientes solo permite ver productos activos.
*/
const obtenerProducto = (req, res) => {
  const sql = `
    SELECT 
      p.*, 
      c.nombre AS categoria 
    FROM productos p
    INNER JOIN categorias c ON p.id_categoria = c.id_categoria
    WHERE p.id_producto = ? 
    AND p.estado_activo = TRUE
  `;

  connection.query(sql, [req.params.id], (error, results) => {
    if (error) {
      return res.status(500).json({
        mensaje: 'Error al obtener producto',
        error
      });
    }

    if (results.length === 0) {
      return res.status(404).json({
        mensaje: 'Producto no encontrado o inactivo'
      });
    }

    res.json(results[0]);
  });
};

/*
  CREAR PRODUCTO
  Solo admin.
*/
const crearProducto = (req, res) => {
  const {
    nombre,
    descripcion,
    marca,
    modelo_compatible,
    precio,
    stock,
    imagen_url,
    id_categoria
  } = req.body;

  if (!nombre || !precio || !stock || !id_categoria) {
    return res.status(400).json({
      mensaje: 'Nombre, precio, stock y categoría son obligatorios'
    });
  }

  const sql = `
    INSERT INTO productos 
    (
      nombre, 
      descripcion, 
      marca, 
      modelo_compatible, 
      precio, 
      stock, 
      imagen_url, 
      id_categoria,
      estado_activo
    ) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, TRUE)
  `;

  connection.query(
    sql,
    [
      nombre,
      descripcion,
      marca,
      modelo_compatible,
      precio,
      stock,
      imagen_url,
      id_categoria
    ],
    (error, result) => {
      if (error) {
        return res.status(500).json({
          mensaje: 'Error al crear producto',
          error
        });
      }

      res.status(201).json({
        mensaje: 'Producto creado correctamente',
        id_producto: result.insertId
      });
    }
  );
};

/*
  ACTUALIZAR PRODUCTO
  Solo admin.
*/
const actualizarProducto = (req, res) => {
  const {
    nombre,
    descripcion,
    marca,
    modelo_compatible,
    precio,
    stock,
    imagen_url,
    id_categoria
  } = req.body;

  const sql = `
    UPDATE productos 
    SET 
      nombre = ?, 
      descripcion = ?, 
      marca = ?, 
      modelo_compatible = ?, 
      precio = ?, 
      stock = ?, 
      imagen_url = ?, 
      id_categoria = ?
    WHERE id_producto = ?
  `;

  connection.query(
    sql,
    [
      nombre,
      descripcion,
      marca,
      modelo_compatible,
      precio,
      stock,
      imagen_url,
      id_categoria,
      req.params.id
    ],
    (error) => {
      if (error) {
        return res.status(500).json({
          mensaje: 'Error al actualizar producto',
          error
        });
      }

      res.json({
        mensaje: 'Producto actualizado correctamente'
      });
    }
  );
};

/*
  CAMBIAR ESTADO DEL PRODUCTO
  Soft Delete: NO elimina físicamente.
  Permite activar o desactivar.
*/
const cambiarEstadoProducto = (req, res) => {
  const { id } = req.params;
  const { estado_activo } = req.body;

  if (estado_activo === undefined) {
    return res.status(400).json({
      mensaje: 'Debe enviar el estado_activo'
    });
  }

  const sql = `
    UPDATE productos 
    SET estado_activo = ? 
    WHERE id_producto = ?
  `;

  connection.query(sql, [estado_activo, id], (error, result) => {
    if (error) {
      return res.status(500).json({
        mensaje: 'Error al cambiar el estado del producto',
        error
      });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({
        mensaje: 'Producto no encontrado'
      });
    }

    res.json({
      mensaje: estado_activo
        ? 'Producto activado correctamente'
        : 'Producto desactivado correctamente'
    });
  });
};

module.exports = {
  listarProductos,
  listarProductosAdmin,
  obtenerProducto,
  crearProducto,
  actualizarProducto,
  cambiarEstadoProducto
};
