var express = require('express');
var kpiController = require('../controllers/kpiController');
var auth = require('../middiewares/authenticate');
var multiparty = require('connect-multiparty');
var path = multiparty({uploadDir: './uploads/productos'});

var app = express.Router();

app.get('/kpi_ventas_mensuales',auth.auth,kpiController.kpi_ventas_mensuales);
app.get('/kpi_compras_mensuales',auth.auth,kpiController.kpi_compras_mensuales);
app.get('/kpi_pagos_tipo/:year/:month',auth.auth,kpiController.kpi_pagos_tipo);
app.get('/kpi_total_ventas',auth.auth,kpiController.kpi_total_ventas);

module.exports = app;