const express = require('express');
const router = express.Router();
const verificarToken = require('../middlewares/verificarToken');
const { listarCarrito, agregarCarrito, actualizarCantidad, quitarCarrito } = require('../Controllers/carrito_controller');
router.get('/', verificarToken, listarCarrito);
router.post('/', verificarToken, agregarCarrito);
router.put('/:id', verificarToken, actualizarCantidad);
router.put('/quitar/:id', verificarToken, quitarCarrito);
module.exports = router;
