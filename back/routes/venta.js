var express =require('express');
var ventaController = require('../controllers/ventaController');
var auth = require('../middiewares/authenticate');
var app = express.Router();

app.get('/obtener_variedad_admin',auth.auth,ventaController.obtener_variedad_admin);
app.post('/generar_venta_admin',auth.auth,ventaController.generar_venta_admin);
app.get('/obtener_ventas_hoy',auth.auth,ventaController.obtener_ventas_hoy);
app.get('/obtener_ventas_fechas/:inicio/:hasta/:cliente',auth.auth,ventaController.obtener_ventas_fechas);
app.get('/listar_clientes_admin',auth.auth,ventaController.listar_clientes_admin);
app.put('/actualizar_venta_admin/:id',auth.auth,ventaController.actualizar_venta_admin);
app.get('/obtener_detalle_ventas/:id',auth.auth,ventaController.obtener_detalle_ventas);
app.get('/obtener_ventas/:id',auth.auth,ventaController.obtener_ventas);
app.delete('/eliminar_detalle_venta_admin/:id',auth.auth,ventaController.eliminar_detalle_venta_admin);
app.get('/obtener_venta_admin/:id',auth.auth,ventaController.obtener_venta_admin);
app.get('/ventas_por_cobrar/:year/:month',auth.auth,ventaController.ventas_por_cobrar);
//app.post('/upload',ventaController.upload,ventaController.uploadFile);

module.exports = app;