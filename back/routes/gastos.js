var express = require('express');
var gastoController = require('../controllers/gastoController');
var auth = require('../middiewares/authenticate');
var multiparty = require('connect-multiparty');

var app = express.Router();

app.get('/listar_proveedores_admin',auth.auth,gastoController.listar_proveedores_admin);
app.get('/obtener_gastos_hoy',auth.auth,gastoController.obtener_gastos_hoy);
app.get('/obtener_gastos_fechas/:inicio/:hasta/:proveedor',auth.auth,gastoController.obtener_gastos_fechas);
app.get('/obtener_gasto_admin/:id',auth.auth,gastoController.obtener_gasto_admin);
app.post('/generar_gasto_admin',auth.auth,gastoController.generar_gasto_admin);
app.get('/obtener_gasto/:id',auth.auth,gastoController.obtener_gasto);
app.get('/obtener_detalle_gasto/:id',auth.auth,gastoController.obtener_detalle_gasto);
app.get('/compras_por_pagar_gastos/:year/:month',auth.auth,gastoController.compras_por_pagar_gastos);
app.delete('/eliminar_detalle_gasto_admin/:id',auth.auth,gastoController.eliminar_detalle_gasto_admin);
app.put('/actualizar_gasto_admin/:id',auth.auth,gastoController.actualizar_gasto_admin);

module.exports = app;