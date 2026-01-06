var express = require('express');
var producto2Controller = require('../controllers/producto2Controller');
var auth = require('../middiewares/authenticate');

var app = express.Router();

app.post('/registrar_producto2_admin',auth.auth,producto2Controller.registrar_producto2_admin);
app.get('/listar_producto2_admin',auth.auth,producto2Controller.listar_producto2_admin);
app.delete('/eliminar_producto_admin/:id',auth.auth,producto2Controller.eliminar_producto_admin);
app.get('/obtener_producto2_admin/:id',auth.auth,producto2Controller.obtener_producto2_admin);
app.put('/actualizar_producto2_admin/:id',auth.auth,producto2Controller.actualizar_producto2_admin);

module.exports = app;