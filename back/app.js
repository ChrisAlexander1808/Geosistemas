var express = require('express');
var bodyparser = require('body-parser');
var mongoose = require('mongoose');
var path = require('path');
require('dotenv').config();

var app = express();

var PORT = process.env.PORT || 4201;
var MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/tecnomuros';


// rutas
var test_routes = require('./routes/test');
var colaborador_routes = require('./routes/colaborador');
var cliente_routes = require('./routes/cliente');
var proveedor_routes = require('./routes/proveedor');
var prospeccion_routes = require('./routes/prospeccion');
var pago_routes = require('./routes/pago');
var venta_routes = require('./routes/venta');
var configuracion_routes = require('./routes/configuracion');
var compra_routes = require('./routes/compra');
var producto_routes = require('./routes/producto');
var proyecto_routes = require('./routes/proyecto');
var ingreso_routes = require('./routes/ingresos');
var gasto_routes = require('./routes/gastos');
var producto2_routes = require('./routes/producto2');
var kpi_routes = require('./routes/kpi');

app.use(bodyparser.urlencoded({ limit: '50mb', extended: true }));
app.use(bodyparser.json({ limit: '50mb', extended: true }));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Access-Control-Allow-Request-Method'
  );
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
  res.header('Allow', 'GET, PUT, POST, DELETE, OPTIONS');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

// FRONTEND estático (Angular build) servido desde /client
app.use('/', express.static('client', { redirect: false }));

// API
app.use('/api', test_routes);
app.use('/api', colaborador_routes);
app.use('/api', cliente_routes);
app.use('/api', proveedor_routes);
app.use('/api', prospeccion_routes);
app.use('/api', producto_routes);
app.use('/api', venta_routes);
app.use('/api', compra_routes);
app.use('/api', pago_routes);
app.use('/api', kpi_routes);
app.use('/api', configuracion_routes);
app.use('/api', producto2_routes);
app.use('/api', proyecto_routes);
app.use('/api', ingreso_routes);
app.use('/api', gasto_routes);

// SPA fallback
app.get('*', function (req, res) {
  return res.sendFile(path.resolve('client/index.html'));
});

async function connectToDatabase() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Mongo conectado:', MONGO_URI);
    app.listen(PORT, function () {
      console.log('✅ Backend corriendo en puerto:', PORT);
    });
  } catch (error) {
    console.error('❌ Error al conectar a la base de datos:', error);
    process.exit(1);
  }
}

connectToDatabase();

module.exports = app;

