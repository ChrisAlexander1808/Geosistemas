var express = require('express');
var proyectoController = require('../controllers/proyectoController');
var auth = require('../middiewares/authenticate');

var app = express.Router();

app.post('/ingresar_proyecto_admin',auth.auth,proyectoController.ingresar_proyecto_admin);
app.get('/listar_proyectos_admin',auth.auth,proyectoController.listar_proyectos_admin);
app.get('/obtener_proyecto_admin/:id',auth.auth,proyectoController.obtener_proyecto_admin);
app.put('/actualizar_proyecto_admin/:id',auth.auth,proyectoController.actualizar_proyecto_admin);
app.delete('/eliminar_proyecto_admin/:id',auth.auth,proyectoController.eliminar_proyecto_admin);
app.get('/obtener_datos_categorias/:id',auth.auth,proyectoController.obtener_datos_categorias);
app.get('/kpi_gastos_categoria/:id',auth.auth,proyectoController.kpi_gastos_categoria);
app.get('/obtener_ingresos_proyecto/:id',auth.auth,proyectoController.obtener_ingresos_proyecto);
app.get('/obtener_listado_gastos/:id/:categoria',auth.auth,proyectoController.obtener_listado_gastos);
app.get('/get_pdf/:archivoPDF', proyectoController.get_pdf);

module.exports = app;