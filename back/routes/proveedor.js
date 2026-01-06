const express = require('express');
//creamos el controlador para estar enlazado
const proveedorController = require('../controllers/proveedorController');
const auth = require('../middiewares/authenticate');

const app = express.Router();

//Rutas que deben ir vinculadas en nuestro Frontend - /panel/services/proveedor.services.ts
app.post('/registro_proveedor_admin', auth.auth,proveedorController.registro_proveedor_admin);
app.get('/listar_proveedores_admin',auth.auth,proveedorController.listar_proveedores_admin);
app.get('/obtener_datos_proveedor_admin/:id',auth.auth,proveedorController.obtener_datos_proveedor_admin);
app.put('/editar_proveedor_admin/:id',auth.auth,proveedorController.editar_proveedor_admin);
app.put('/cambiar_estado_proveedor_admin/:id',auth.auth,proveedorController.cambiar_estado_proveedor_admin);
app.get('/listar_proveedores_modal_admin/:filtro',auth.auth,proveedorController.listar_proveedores_modal_admin);


module.exports = app;

