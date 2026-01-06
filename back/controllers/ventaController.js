var Producto = require('../models/Producto');
var Variedad = require('../models/Variedad');
const Venta = require('../models/Venta');
const Pago = require('../models/Pago');
const Cliente = require('../models/Cliente');
const Venta_detalle = require('../models/Venta_detalle');
const Compra_detalle = require('../models/Compra_detalle');
var moment = require('moment');
const { now } = require('mongoose');
const mongoose = require('mongoose');
const Compra = require('../models/Compra');
const multer = require('multer');

const obtener_variedad_admin = async function(req,res){
    if(req.user){

        let variedades = await Variedad.find().populate('producto').sort({titulo:1});
        res.status(200).send({data:variedades}); 
    }else{
        res.status(403).send({data:undefined,message:'NoToken'});
    }
}

const generar_venta_admin = async function(req,res){
    if (req.user) {
        let today = new Date();
        let data = req.body;        
        
        try {
            const lasVenta = await Venta.findOne().sort({correlativo: -1});
            let correlativo = 1;

            if (lasVenta) {
                correlativo = lasVenta.correlativo +1;
            }

            let venta = {
                cliente: data.cliente,
                asesor: req.user.sub,
                origen: data.origen,
                canal: data.canal,
                estado: data.estado,
                monto : data.monto,
                saldo : data.saldo,
                dia : today.getDate(),
                mes : today.getMonth()+1,
                year : today.getFullYear(),
                correlativo,
                factura : data.factura,
                fechafactura : data.fechafactura,
                vehiculo : data.vehiculo,
                placa : data.placa,
                empresa : data.empresa
            }                  
    
            let reg_venta = await Venta.create(venta);
    
            for (var item of data.detalles) {
                let detalle = {
                    cliente : reg_venta.cliente,
                    asesor : reg_venta.asesor,
                    venta : reg_venta._id,
                    producto : item.producto,
                    precio : item.precio,
                    titulo : item.titulo,
                    titulo_v : item.titulo_v,
                    cantidad : parseInt(item.cantidad),
                    variedad : item.variedad,                
                    dia : today.getDate(),
                    mes : today.getMonth()+1,
                    year : today.getFullYear(),
                    estado: data.estado,
                }
                let reg_detalle = await Venta_detalle.create(detalle);          
    
                               
                disminuir_stock_admin(reg_detalle.variedad,reg_detalle.producto,reg_detalle.cantidad);

            }
            res.status(200).send({data:venta});

        } catch (error) {
            console.error(error);
            res.status(500).send({data:undefined, message: 'Error interno del servidor'});
        }         
    
    } else {
        res.status(403).send({data:undefined,message:'NoToken'});
    }
}

const actualizar_venta_admin = async function (req,res) {
   
   if(req.user){
    let id = req.params['id'];
    let today = new Date();
    let data = req.body;

    try {    

         let ventaActualizada = await Venta.findByIdAndUpdate({_id:id},{
            cliente: data.cliente,
            asesor: req.user.sub,
            origen: data.origen,
            canal: data.canal,
            estado: data.estado,
            monto : data.monto,
            saldo : data.saldo,
            factura : data.factura,
            fechafactura : data.fechafactura,
            vehiculo : data.vehiculo,
            placa : data.placa,
            });

            for (var item of data.ventas_detalle) {

                if(item._id && item.cliente){  

                    let detalle = {
                        cliente : ventaActualizada.cliente,
                        asesor : ventaActualizada.asesor,
                        venta : ventaActualizada._id,
                        producto : item.producto,
                        titulo : item.titulo,
                        titulo_v : item.titulo_v,
                        precio : item.precio,
                        cantidad : parseInt(item.cantidad),
                        variedad : item.variedad,               
                        estado: data.estado,
                    };                   
                    
                    await Venta_detalle.findByIdAndUpdate(item._id, detalle);
                                   
                    
                }else{
                    let detalle2 = {
                        cliente : ventaActualizada.cliente,
                        asesor : ventaActualizada.asesor,
                        venta : ventaActualizada._id,
                        producto : item.producto,
                        variedad : item.variedad,
                        titulo : item.titulo,
                        titulo_v : item.titulo_v,
                        precio : item.precio,
                        cantidad : parseInt(item.cantidad),                                       
                        estado: data.estado,
                        dia : today.getDate(),
                        mes : today.getMonth()+1,
                        year : today.getFullYear(),
                    }

                    let regdetalle = await Venta_detalle.create(detalle2);

                    disminuir_stock_admin(regdetalle.variedad,regdetalle.producto,regdetalle.cantidad);
                }      
            } 
            res.status(200).send({data:ventaActualizada});   
        }
        catch (error) {
        console.log(error);
        res.status(200).send({data:undefined,message:'Ocurrio un problema al registrar la venta.'})
        }
    }else{
    res.status(403).send({data:undefined,message:'NoToken'});

    }
}

const eliminar_detalle_venta_admin = async function(req,res){
    if(req.user){
        let id = req.params['id'];
        let detalle = await Venta_detalle.findByIdAndRemove({_id:id});
        
            await Venta_detalle.findById({_id:id});

            aumentar_stock_admin(detalle.variedad,detalle.producto,detalle.cantidad);

            res.status(200).send({data:detalle}); 
       
    }else{
        res.status(403).send({data:undefined,message:'NoToken'});
    }
}

const obtener_detalle_ventas = async function(req,res){
    if(req.user){
        let id = req.params['id'];
        try {
            let ventas_detalle = await Venta_detalle.find({venta:id}).populate('producto').populate('variedad');
            res.status(200).send({data:ventas_detalle});
        } catch (error) {
            res.status(200).send({data:undefined});
        }
    }else{
        res.status(403).send({data:undefined,message:'NoToken'});
    }
}

const obtener_ventas = async function(req,res){
    if (req.user) {   
        let id = req.params['id'];
        try {
            let ventas = await Venta.findById({_id:id}).populate('cliente');
            res.status(200).send({data:ventas});
        } catch (error) {
            res.status(200).send({data:undefined});
        }
    }else{
        res.status(403).send({data:undefined,message:'NoToken'});
    }
}

const obtener_ventas_hoy = async function(req,res){
    if (req.user) {
        let today = new Date();
        let dia = today.getDate();
        let mes = today.getMonth()+1;
        let year = today.getFullYear();

        let ventas = await Venta.find({
            dia:dia,
            mes:mes,
            year:year
        }).populate('cliente').sort({createdAt:1});

        
        res.status(200).send({data:ventas,ventas});

    } else {
        res.status(403).send({data:undefined,message:'NoToken'});
    }
}

const obtener_ventas_fechas = async function (req,res) {
    if (req.user) {
        let inicio = req.params['inicio'];
        let hasta = req.params['hasta'];
        let clienteId = req.params['cliente'];

        let ventas = [];      

        if (clienteId == 'Todos') {
            ventas = await Venta.find({
                createdAt: {
                    $gte: new Date(inicio + 'T00:00:00'),
                    $lt: new Date(hasta + 'T23:59:59')
                }
            }).populate('cliente').sort({createdAt:1});
        }else{
            ventas = await Venta.find({
                createdAt: {
                    $gte: new Date(inicio + 'T00:00:00'),
                    $lt: new Date(hasta + 'T23:59:59')
                },  cliente: clienteId
            }).populate('cliente').sort({createdAt:1});
        }
        
        
        res.status(200).send({data:ventas});        

    } else {
        res.status(403).send({data:undefined,message:'NoToken'});
    }
}

const listar_clientes_admin = async function(req,res){
    if(req.user){
        let clientes = await Cliente.find({estado:true}).select('_id razonsocial');
        res.status(200).send({data:clientes});
    }else{
        res.status(403).send({data:undefined,message:'Notoken'});
    }
}

const disminuir_stock_admin = async function(id,idp,cantidad){
    //variedad
    let variedad = await Variedad.findById({_id:id});
    let nuevo_stock_actual = variedad.stock - parseInt(cantidad);
    await Variedad.findByIdAndUpdate({_id:id},{
        stock : nuevo_stock_actual
    });

    //producto
    let producto = await Producto.findById({_id:idp});
    let nuevo_stock_general = producto.stock - parseInt(cantidad);
    await Producto.findByIdAndUpdate({_id:idp},{
        stock : nuevo_stock_general
    });
}

const aumentar_stock_admin = async function(id,idp,cantidad){
    //variedad
    let variedad = await Variedad.findById({_id:id});
    let nuevo_stock_actual = variedad.stock + parseInt(cantidad);
    await Variedad.findByIdAndUpdate({_id:id},{
        stock : nuevo_stock_actual
    });

    //producto
    let producto = await Producto.findById({_id:idp});
    let nuevo_stock_general = producto.stock + parseInt(cantidad);
    await Producto.findByIdAndUpdate({_id:idp},{
        stock : nuevo_stock_general
    });
}

const obtener_venta_admin = async function(req,res){
    if (req.user) {   
        let id = req.params['id'];
        try {
            let venta = await Venta.findById({_id:id}).populate('cliente');
            let detalles = await Venta_detalle.find({venta:id});
                res.status(200).send({data:venta,detalles:detalles});
        } catch (error) {
            res.status(200).send({data:undefined});
        }
    }else{
        res.status(403).send({data:undefined,message:'NoToken'});
    }
}

const ventas_por_cobrar = async function (req, res) {
    if (req.user) {
        try {
            let year = req.params['year'];
            let month = req.params['month'];

            // Calcular la fecha de inicio del año y mes proporcionados
            const inicioFecha = new Date(Date.UTC(parseInt(year), parseInt(month) - 1, 1, 0, 0, 0, 0));

            // Consultar las ventas con saldo mayor a cero hasta el mes y año proporcionados
            const ventasConSaldo = await Venta.find({
                createdAt: {
                    $lte: inicioFecha,
                },
                saldo: { $gt: 0 },
            }).populate('cliente');

            res.status(200).json({ data: ventasConSaldo });

        } catch (error) {
            console.error('Errore en ventas: ', error);
            res.status(500).send({ message: 'Error interno en el servidor' });
        }

    } else {
        res.status(403).send({ data: undefined, message: 'NoToken' });
    }
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/facturas');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, `${uniqueSuffix}-${file.originalname}`);
    }
});

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/pdf') {
            cb(null, true); // Acepta el archivo
        } else {
            cb(null, false); // Rechaza el archivo
            cb(new Error('Solo se permiten archivos PDF'));
        }
    }
});

exports.upload = (req, res, next) => {
    // Lógica para la carga de archivos
    next();
}

exports.uploadFile = (req, res) => {
    try {
        // Lógica para manejar el archivo subido
        res.send({ data: 'Archivo enviado' });
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'Error interno del servidor' });
    }
}


module.exports = {
    obtener_variedad_admin,
    generar_venta_admin,
    obtener_ventas_hoy,
    obtener_ventas_fechas,
    listar_clientes_admin,
    actualizar_venta_admin,
    obtener_detalle_ventas,
    obtener_ventas,
    eliminar_detalle_venta_admin,
    obtener_venta_admin,
    ventas_por_cobrar,
    upload
}