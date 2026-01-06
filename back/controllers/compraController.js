var Proveedor = require('../models/Proveedor');
var Pago = require('../models/Pago');
var Venta = require('../models/Venta');
const Compra = require('../models/Compra');
const Compra_detalle = require('../models/Compra_detalle');
var moment = require('moment');

const listar_proveedores_admin = async function(req,res){
    if(req.user){
        let proveedores = await Proveedor.find({estado:true}).select('_id razonsocial');
        res.status(200).send({data:proveedores});
    }else{
        res.status(403).send({data:undefined,message:'Notoken'});
    }
}

const listar_ventas_admin = async function(req,res){
    if(req.user){
        let ventas = await Venta.find().select('_id correlativo monto').populate('cliente').sort({createdAt:-1});
        res.status(200).send({data:ventas});
    }else{
        res.status(403).send({data:undefined,message:'Notoken'});
    }
}

const generar_compra_admin = async function(req,res){
    if (req.user) {
        let today = new Date();
        let data = req.body;        
        
        try {
            const lasCompra = await Compra.findOne().sort({correlativo: -1});
            let correlativo = 1;

            if (lasCompra) {
                correlativo = lasCompra.correlativo +1;
            }        
            
            if (data.tipo == 'Credito') {
                let compra = {
                    proveedor: data.proveedor,
                    nit: data.nit,
                    comprador: req.user.sub,  
                    venta: data.venta,
                    factura: data.factura,
                    fechafactura: data.fechafactura,
                    observaciones: data.observaciones,
                    documento: data.documento,
                    tipo: data.tipo,
                    estado: data.estado,
                    monto : data.monto,
                    saldo : data.saldo,
                    descuento: data.descuento,
                    dia : today.getDate(),
                    mes : today.getMonth()+1,
                    year : today.getFullYear(),
                    correlativo,
                } 
                let reg_compra = await Compra.create(compra);

                for (var item of data.detalles_compras) {
                    let detalle = {
                        proveedor : reg_compra.proveedor,
                        comprador : reg_compra.comprador,
                        compra : reg_compra._id,
                        venta : reg_compra.venta,
                        producto : item.producto,
                        titulo : item.titulo,
                        titulo_v : item.titulo_v,
                        precio : item.precio,
                        cantidad : parseInt(item.cantidad),
                        variedad : item.variedad,                
                        dia : today.getDate(),
                        mes : today.getMonth()+1,
                        year : today.getFullYear(),
                        estado: data.estado,
                    }
                    await Compra_detalle.create(detalle);
                }
                
                res.status(200).send({data:compra});
            } else {
                let compra = {
                    proveedor: data.proveedor,
                    nit: data.nit,
                    comprador: req.user.sub,
                    venta: data.venta,  
                    factura: data.factura,
                    fechafactura: data.fechafactura,
                    observaciones: data.observaciones,
                    documento: data.documento,
                    tipo: data.tipo,
                    estado: 'Cancelado',
                    monto : data.monto,
                    saldo : 0,
                    descuento: data.descuento,
                    dia : today.getDate(),
                    mes : today.getMonth()+1,
                    year : today.getFullYear(),
                    correlativo,
                } 
                let reg_compra = await Compra.create(compra);

                for (var item of data.detalles_compras) {
                    let detalle = {
                        proveedor : reg_compra.proveedor,
                        comprador : reg_compra.comprador,
                        compra : reg_compra._id,
                        venta : reg_compra.venta,
                        producto : item.producto,
                        titulo : item.titulo,
                        titulo_v : item.titulo_v,
                        precio : item.precio,
                        cantidad : parseInt(item.cantidad),
                        variedad : item.variedad,                
                        dia : today.getDate(),
                        mes : today.getMonth()+1,
                        year : today.getFullYear(),
                        estado: data.estado,
                    }
                    await Compra_detalle.create(detalle);
                }  
                

                let pagocompra = {
                    proveedor: reg_compra.proveedor,
                    comprador: req.user.sub,
                    compra: reg_compra._id,
                    monto: data.monto,
                    tipo: 'Compras',
                    metodo: 'Automatico',
                    banco: 'S/B',
                    fecha: today,
                    transaccion: 'N/A',                  
                    estado: 'Aprobado',                
                }

                let pagos = await Pago.find().sort({createdAt:-1});

                if (pagos.length == 0) {
                    pagocompra.correlativo = 1;
                    await Pago.create(pagocompra);
                }else {
                    let last_correlativo = pagos[0].correlativo;
                    pagocompra.correlativo = last_correlativo + 1;
                    await Pago.create(pagocompra);
                }

                res.status(200).send({data:compra});
            }                                            

        } catch (error) {
            console.error(error);
            res.status(500).send({data:undefined, message: 'Error interno del servidor'});
        }         
    
    } else {
        res.status(403).send({data:undefined,message:'NoToken'});
    }
}

const actualizar_compra_admin = async function(req,res){
    if(req.user){
        let id = req.params['id'];
        let today = new Date();
        let data = req.body;
    
        try {    
    
             let compraActualizada = await Compra.findByIdAndUpdate({_id:id},{
                proveedor: data.proveedor,
                nit: data.nit,
                venta: data.venta,
                factura: data.factura,
                fechafactura: data.fechafactura,
                observaciones: data.observaciones,
                documento: data.documento,
                tipo: data.tipo,
                estado: data.estado,
                monto : data.monto,
                saldo : data.saldo,
                descuento : data.descuento,
                });
    
                for (var item of data.compras_detalle) {

                    const detalle = {
                        proveedor : compraActualizada.proveedor,
                        compra : compraActualizada._id,
                        venta: data.venta,
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
                    };    
    
                    if(item._id && item.proveedor){    
                                
                        await Compra_detalle.findByIdAndUpdate(item._id, detalle,{new: true});
                       
                    }else{
    
                        const nuevoDetalle = new Compra_detalle(detalle);
                        await nuevoDetalle.save();
                    }      
                } 
                res.status(200).send({data:compraActualizada});   
            }
            catch (error) {
            console.log(error);
            res.status(200).send({data:undefined,message:'Ocurrio un problema al registrar la venta.'})
            }
        }else{
        res.status(403).send({data:undefined,message:'NoToken'});
    
        }
}

const obtener_compras_hoy = async function(req,res){
    if (req.user) {
        let today = new Date();
        let dia = today.getDate();
        let mes = today.getMonth()+1;
        let year = today.getFullYear();

        let compras = await Compra.find({
            dia:dia,
            mes:mes,
            year:year
        }).populate('proveedor').sort({createdAt:1});

        res.status(200).send({data:compras});

    } else {
        res.status(403).send({data:undefined,message:'NoToken'});
    }
}

const obtener_compras_fechas = async function (req,res) {
    if (req.user) {
        let inicio = req.params['inicio'];
        let hasta = req.params['hasta'];
        let proveedorId = req.params['proveedor'];

        let compras = [];       

        if (proveedorId == 'Todos') {
            compras = await Compra.find({
                createdAt: {
                $gte: new Date(inicio + 'T00:00:00'),
                $lt: new Date(hasta + 'T23:59:59')
            }
        }).populate('proveedor').sort({createdAt:1});
        }else{
            compras = await Compra.find({
                createdAt: {
                    $gte: new Date(inicio + 'T00:00:00'),
                    $lt: new Date(hasta + 'T23:59:59')
                },
                proveedor: proveedorId
            }).populate('proveedor').sort({createdAt:1});
        }
        
        
        res.status(200).send({data:compras});        

    } else {
        res.status(403).send({data:undefined,message:'NoToken'});
    }
}

const obtener_compra_admin = async function(req,res){
    if (req.user) {   
        let id = req.params['id'];
        try {
            let compra = await Compra.findById({_id:id}).populate('proveedor');
            let detalles = await Compra_detalle.find({compra:id}).populate('producto').populate('variedad');
                res.status(200).send({data:compra,detalles:detalles});
        } catch (error) {
            res.status(200).send({data:undefined});
        }
    }else{
        res.status(403).send({data:undefined,message:'NoToken'});
    }
}

const obtener_compra = async function(req,res){
    if (req.user) {   
        let id = req.params['id'];
        try {
            let compra = await Compra.findById({_id:id}).populate('proveedor');
            res.status(200).send({data:compra});
        } catch (error) {
            res.status(200).send({data:undefined});
        }
    }else{
        res.status(403).send({data:undefined,message:'NoToken'});
    }
}

const obtener_detalle_compra = async function(req,res){
    if(req.user){
        let id = req.params['id'];
        try {
            let compra_detalle = await Compra_detalle.find({compra:id}).populate('producto').populate('variedad');
            res.status(200).send({data:compra_detalle});
        } catch (error) {
            res.status(200).send({data:undefined});
        }
    }else{
        res.status(403).send({data:undefined,message:'NoToken'});
    }
}

const eliminar_detalle_compra_admin = async function(req,res){
    if(req.user){
        let id = req.params['id'];
        let detalle = await Compra_detalle.findByIdAndRemove({_id:id});
        
            await Compra_detalle.findById({_id:id});

            res.status(200).send({data:detalle}); 
       
    }else{
        res.status(403).send({data:undefined,message:'NoToken'});
    }
}

const compras_por_pagar = async function (req, res) {
    if (req.user) {
        try {
            let year = req.params['year'];
            let month = req.params['month'];

            // Calcular la fecha de inicio y fin del mes
            const inicioFecha = new Date(Date.UTC(parseInt(year), parseInt(month) - 1, 1, 0, 0, 0, 0));

            // Consultar las ventas con saldo mayor a cero en el rango de fechas
            const comprasConSaldo = await Compra.find({
                createdAt: {
                    $lte: inicioFecha,
                },
                saldo: { $gt: 0 },
            }).populate('proveedor');

            res.status(200).json({ data: comprasConSaldo }); 

        } catch (error) {
            res.status(500).send({message:'Error interno en el servidor'});
        }     
    
    }else{
        res.status(403).send({data:undefined,message:'NoToken'});
    }
}

const obtener_detalle_vc = async function(req,res){
    if(req.user){
        let id = req.params['id'];
        try {
            let compra_detalle = await Compra_detalle.find({venta:id}).select('titulo titulo_v cantidad precio');
            res.status(200).send({data:compra_detalle});
        } catch (error) {
            res.status(200).send({data:undefined});
        }
    }else{
        res.status(403).send({data:undefined,message:'NoToken'});
    }
}

module.exports = {
    listar_proveedores_admin,
    generar_compra_admin,
    obtener_compras_hoy,
    obtener_compras_fechas,
    obtener_compra_admin,
    obtener_compra,
    obtener_detalle_compra,
    eliminar_detalle_compra_admin,
    actualizar_compra_admin,
    compras_por_pagar,
    listar_ventas_admin,
    obtener_detalle_vc
}