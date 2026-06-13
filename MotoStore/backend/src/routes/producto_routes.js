const express = require('express');
const router = express.Router();

const productoController = require('../Controllers/producto_controller');
const verificarToken = require('../middlewares/verificarToken');
const verificarAdmin = require('../middlewares/verificarAdmin');

/*
  RUTA PÚBLICA
  Cliente ve solo productos activos.
*/
router.get('/', productoController.listarProductos);

/*
  RUTA ADMIN
  Admin ve productos activos e inactivos.
*/
router.get(
  '/admin/todos',
  verificarToken,
  verificarAdmin,
  productoController.listarProductosAdmin
);

/*
  RUTA PÚBLICA
  Cliente ve detalle solo si está activo.
*/
router.get('/:id', productoController.obtenerProducto);

/*
  RUTAS ADMIN
  Crear, editar y activar/desactivar productos.
*/
router.post(
  '/',
  verificarToken,
  verificarAdmin,
  productoController.crearProducto
);

router.put(
  '/estado/:id',
  verificarToken,
  verificarAdmin,
  productoController.cambiarEstadoProducto
);

router.put(
  '/:id',
  verificarToken,
  verificarAdmin,
  productoController.actualizarProducto
);

module.exports = router;
