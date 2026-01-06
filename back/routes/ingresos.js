var express =require('express');
var ingresoController = require('../controllers/ingresoController');
var auth = require('../middiewares/authenticate');
var upload = require('../middiewares/multerConfig');
var multiparty = require('connect-multiparty');
var path = multiparty({uploadDir: './uploads/facturas'});
var app = express.Router();

app.get('/listar_clientes_admin',auth.auth,ingresoController.listar_clientes_admin);
app.get('/obtener_ingresos_hoy',auth.auth,ingresoController.obtener_ingresos_hoy);
app.get('/obtener_ingresos_fechas/:inicio/:hasta/:cliente',auth.auth,ingresoController.obtener_ingresos_fechas);
app.get('/listar_proyectos_modal_admin',auth.auth,ingresoController.listar_proyectos_modal_admin);
app.get('/obtener_producto_admin',auth.auth,ingresoController.obtener_producto_admin);
app.post('/generar_ingreso_admin',auth.auth,upload.single('archivopdf'),ingresoController.generar_ingreso_admin);
app.get('/obtener_ingreso_admin/:id',auth.auth,ingresoController.obtener_ingreso_admin);
app.get('/obtener_detalle_ingreso/:id',auth.auth,ingresoController.obtener_detalle_ingreso);
app.get('/obtener_ingreso/:id',auth.auth,ingresoController.obtener_ingreso);
app.delete('/eliminar_detalle_ingreso_admin/:id',auth.auth,ingresoController.eliminar_detalle_ingreso_admin);
app.put('/actualizar_ingreso_admin/:id',auth.auth,upload.single('archivopdf'),ingresoController.actualizar_ingreso_admin);
app.get('/ingresos_por_cobrar/:year/:month',auth.auth,ingresoController.ingresos_por_cobrar);
app.post('/upload',upload.single('myFile'),(req, res)=>{
    const file = req.file;
    res.send({data:"OK"})});

module.exports = app;