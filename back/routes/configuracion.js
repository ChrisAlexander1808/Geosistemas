var express = require('express');
var configuracionController = require('../controllers/configuracionController');
var auth = require('../middiewares/authenticate');
var multiparty = require('connect-multiparty');
var path = multiparty({uploadDir: './uploads/config'});

var app = express.Router();

app.get('/obtener_configuracion_general',auth.auth,configuracionController.obtener_configuracion_general);
app.put('/actualizar_configuracion_general',[auth.auth,path],configuracionController.actualizar_configuracion_general);
app.get('/get_image_config/:img',configuracionController.get_image_config);

module.exports = app;