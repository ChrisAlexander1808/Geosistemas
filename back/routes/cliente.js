const express = require('express');
//creamos el controlador para estar enlazado
const clienteController = require('../controllers/clienteController');
const auth = require('../middiewares/authenticate');

const app = express.Router();

//Rutas que deben ir vinculadas en nuestro Frontend - /panel/services/cliente.services.ts
app.post('/registro_cliente_admin', auth.auth,clienteController.registro_cliente_admin);
app.get('/validar_correo_verificacion/:token',clienteController.validar_correo_verificacion);
app.get('/listar_clientes_admin',auth.auth,clienteController.listar_clientes_admin);
app.get('/obtener_datos_cliente_admin/:id',auth.auth,clienteController.obtener_datos_cliente_admin);
app.put('/editar_cliente_admin/:id',auth.auth,clienteController.editar_cliente_admin);
app.put('/cambiar_estado_cliente_admin/:id',auth.auth,clienteController.cambiar_estado_cliente_admin);
app.get('/listar_clientes_modal_admin/:filtro',auth.auth,clienteController.listar_clientes_modal_admin);


module.exports = app;
