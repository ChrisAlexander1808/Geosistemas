var express = require('express');
var compraController = require('../controllers/compraController');
var auth = require('../middiewares/authenticate');
var multiparty = require('connect-multiparty');
var path = multiparty({uploadDir: './uploads/productos'});

var app = express.Router();

app.get('/listar_proveedores_admin',auth.auth,compraController.listar_proveedores_admin);
app.post('/generar_compra_admin',auth.auth,compraController.generar_compra_admin);
app.get('/obtener_compras_hoy',auth.auth,compraController.obtener_compras_hoy);
app.get('/obtener_compras_fechas/:inicio/:hasta/:proveedor',auth.auth,compraController.obtener_compras_fechas);
app.get('/obtener_compra_admin/:id',auth.auth,compraController.obtener_compra_admin);
app.get('/obtener_compra/:id',auth.auth,compraController.obtener_compra);
app.get('/obtener_detalle_compra/:id',auth.auth,compraController.obtener_detalle_compra);
app.delete('/eliminar_detalle_compra_admin/:id',auth.auth,compraController.eliminar_detalle_compra_admin);
app.put('/actualizar_compra_admin/:id',auth.auth,compraController.actualizar_compra_admin);
app.get('/compras_por_pagar/:year/:month',auth.auth,compraController.compras_por_pagar);
app.get('/listar_ventas_admin',auth.auth,compraController.listar_ventas_admin);
app.get('/obtener_detalle_vc/:id',auth.auth,compraController.obtener_detalle_vc);

module.exports = app;