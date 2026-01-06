var express = require('express');
var pagoController = require('../controllers/pagoController');
var auth = require('../middiewares/authenticate');
var app = express.Router();


app.get('/obtener_pago_vc_admin/:id',auth.auth,pagoController.obtener_pago_vc_admin);
app.post('/crear_pagocompra_admin',auth.auth,pagoController.crear_pagocompra_admin);
app.post('/crear_pagoventa_admin',auth.auth,pagoController.crear_pagoventa_admin);
app.get('/obtener_pagos_general',auth.auth,pagoController.obtener_pagos_general);
app.post('/crear_pagovingreso_admin',auth.auth,pagoController.crear_pagovingreso_admin);
app.post('/crear_pagogasto_admin',auth.auth,pagoController.crear_pagogasto_admin);
app.get('/obtener_pago_ig_admin/:id',auth.auth,pagoController.obtener_pago_ig_admin);

module.exports = app;