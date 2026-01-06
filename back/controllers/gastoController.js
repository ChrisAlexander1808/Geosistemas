var Proveedor = require('../models/Proveedor');
var Proyecto = require('../models/Proyecto');
var Pago = require('../models/Pago');
const Gasto = require('../models/Gasto');
const Gasto_detalle = require('../models/Gasto_detalle');
var moment = require('moment');

const listar_proveedores_admin = async function(req,res){
    if(req.user){
        let proveedores = await Proveedor.find({estado:true}).select('_id nombrecomercial');
        res.status(200).send({data:proveedores});
    }else{
        res.status(403).send({data:undefined,message:'Notoken'});
    }
}

const obtener_gastos_hoy = async function(req,res){
    if (req.user) {
        let today = new Date();
        let dia = today.getDate();
        let mes = today.getMonth()+1;
        let year = today.getFullYear();

        let gastos = await Gasto.find({
            dia:dia,
            mes:mes,
            year:year
        }).populate('proveedor').populate('proyecto').sort({createdAt:1});

        res.status(200).send({data:gastos});

    } else {
        res.status(403).send({data:undefined,message:'NoToken'});
    }
}

const obtener_gastos_fechas = async function (req,res) {
    if (req.user) {
        let inicio = req.params['inicio'];
        let hasta = req.params['hasta'];
        let proveedorId = req.params['proveedor'];

        let gastos = [];       

        if (proveedorId == 'Todos') {
            gastos = await Gasto.find({
                createdAt: {
                $gte: new Date(inicio + 'T00:00:00'),
                $lt: new Date(hasta + 'T23:59:59')
            }
        }).populate('proveedor').populate('proyecto').sort({createdAt:1});
        }else{
            gastos = await Gasto.find({
                createdAt: {
                    $gte: new Date(inicio + 'T00:00:00'),
                    $lt: new Date(hasta + 'T23:59:59')
                },
                proveedor: proveedorId
            }).populate('proveedor').populate('proyecto').sort({createdAt:1});
        }
        
        
        res.status(200).send({data:gastos});        

    } else {
        res.status(403).send({data:undefined,message:'NoToken'});
    }
}

const obtener_gasto_admin = async function(req,res){
    if (req.user) {   
        let id = req.params['id'];
        try {
            let gasto = await Gasto.findById({_id:id}).populate('proveedor').populate('proyecto');
            let detalles = await Gasto_detalle.find({compra:id});
                res.status(200).send({data:gasto,detalles:detalles});
        } catch (error) {
            res.status(200).send({data:undefined});
        }
    }else{
        res.status(403).send({data:undefined,message:'NoToken'});
    }
}

const generar_gasto_admin = async function(req,res){
    if (req.user) {
        let today = new Date();
        let data = req.body;        
        
        try {
            const lasCompra = await Gasto.findOne().sort({correlativo: -1});
            let correlativo = 1;

            if (lasCompra) {
                correlativo = lasCompra.correlativo +1;
            }        
            
            if (data.tipo == 'Credito') {
                let compra = {
                    proveedor: data.proveedor,
                    proyecto: data.proyecto,
                    factura: data.factura,
                    fechafactura: data.fechafactura,
                    categoria: data.categoria,
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
                let reg_compra = await Gasto.create(compra);

                for (var item of data.detalles_compras) {
                    let detalle = {
                        proveedor : reg_compra.proveedor,
                        proyecto : reg_compra.proyecto,
                        compra : reg_compra._id,
                        producto : item.producto,
                        descripcion : item.descripcion,
                        precio : item.precio,
                        cantidad : parseInt(item.cantidad),         
                        dia : today.getDate(),
                        mes : today.getMonth()+1,
                        year : today.getFullYear(),
                        estado: data.estado,
                    }
                    await Gasto_detalle.create(detalle);
                }
                aumentar_gasto_proyecto(reg_compra.proyecto,reg_compra.monto);
                res.status(200).send({data:compra});
            } else {
                let compra = {
                    proveedor: data.proveedor,
                    proyecto: data.proyecto, 
                    factura: data.factura,
                    fechafactura: data.fechafactura,
                    categoria: data.categoria,
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
                let reg_compra = await Gasto.create(compra);

                for (var item of data.detalles_compras) {
                    let detalle = {
                        proveedor : reg_compra.proveedor,
                        proyecto : reg_compra.proyecto,
                        compra : reg_compra._id,
                        producto : item.producto,
                        descripcion : item.descripcion,
                        precio : item.precio,
                        cantidad : parseInt(item.cantidad),
                        variedad : item.variedad,                
                        dia : today.getDate(),
                        mes : today.getMonth()+1,
                        year : today.getFullYear(),
                        estado: 'Cancelado',
                    }
                    await Gasto_detalle.create(detalle);
                }  
                

                let pagocompra = {
                    proveedor: reg_compra.proveedor,
                    comprador: req.user.sub,
                    estado: 'Aprobado',
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
                aumentar_gasto_proyecto(reg_compra.proyecto,reg_compra.monto);
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

const aumentar_gasto_proyecto = async function(idx,ingreso){

    let proyecto = await Proyecto.findById(idx);
    let nuevo_gasto = proyecto.gastos + parseInt(ingreso);
    await Proyecto.findByIdAndUpdate(idx, {        
        gastos : nuevo_gasto
    });
}

const obtener_gasto = async function(req,res){
    if (req.user) {   
        let id = req.params['id'];
        try {
            let gasto = await Gasto.findById({_id:id}).populate('proveedor').populate('proyecto');
            res.status(200).send({data:gasto});
        } catch (error) {
            res.status(200).send({data:undefined});
        }
    }else{
        res.status(403).send({data:undefined,message:'NoToken'});
    }
}

const compras_por_pagar_gastos = async function (req, res) {
    if (req.user) {
        try {
            let year = req.params['year'];
            let month = req.params['month'];

            // Calcular la fecha de inicio y fin del mes
            const inicioFecha = new Date(Date.UTC(parseInt(year), parseInt(month) - 1, 1, 0, 0, 0, 0));

            // Consultar las ventas con saldo mayor a cero en el rango de fechas
            const comprasConSaldo = await Gasto.find({
                createdAt: {
                    $lte: inicioFecha,
                },
                saldo: { $gt: 0 },
            }).populate('proveedor').populate('proyecto');

            res.status(200).json({ data: comprasConSaldo }); 

        } catch (error) {
            res.status(500).send({message:'Error interno en el servidor'});
        }     
    
    }else{
        res.status(403).send({data:undefined,message:'NoToken'});
    }
}

const obtener_detalle_gasto = async function(req,res){
    if(req.user){
        let id = req.params['id'];
        try {
            let gasto_detalle = await Gasto_detalle.find({compra:id});
            res.status(200).send({data:gasto_detalle});
        } catch (error) {
            res.status(200).send({data:undefined});
        }
    }else{
        res.status(403).send({data:undefined,message:'NoToken'});
    }
}

const eliminar_detalle_gasto_admin = async function(req,res){
    if(req.user){
        let id = req.params['id'];
        let detalle = await Gasto_detalle.findByIdAndRemove({_id:id});
        
            await Gasto_detalle.findById({_id:id});
            reducir_gastos_admin(detalle.proyecto,detalle.precio);

            res.status(200).send({data:detalle}); 
       
    }else{
        res.status(403).send({data:undefined,message:'NoToken'});
    }
}

const reducir_gastos_admin = async function(id,monto){
 
    let proyecto = await Proyecto.findById({_id:id});
    let nuevo_gasto_actual = proyecto.gastos - parseInt(monto);
    await Proyecto.findByIdAndUpdate({_id:id},{
        gastos : nuevo_gasto_actual
    });

}

const actualizar_gasto_admin = async function(req,res){
    if(req.user){
        let id = req.params['id'];
        let today = new Date();
        let data = req.body;
    
        try {   
             let gasto = await Gasto.findById(id);

             if(gasto.monto < data.monto){
                aumentar_gasto_proyecto(data.proyecto,(data.monto-gasto.monto)); 
             }

             let compraActualizada = await Gasto.findByIdAndUpdate({_id:id},{
                proveedor: data.proveedor,
                proyecto: data.proyecto,
                factura: data.factura,
                fechafactura: data.fechafactura,
                categoria: data.categoria,
                estado: data.estado,
                monto : data.monto,
                saldo : data.saldo,
                descuento : data.descuento,
                });                
                
                for (var item of data.compras_detalle) {                    
    
                    if(item._id && item.proveedor){  
    
                        let detalle = {
                            proveedor : compraActualizada.proveedor,
                            proyecto : compraActualizada.proyecto,
                            compra : compraActualizada._id,
                            producto : item.producto,
                            descripcion : item.descripcion,
                            precio : item.precio,
                            cantidad : parseInt(item.cantidad),                                           
                            estado: data.estado,
                        };                   
                        
                        await Gasto_detalle.findByIdAndUpdate(item._id, detalle);                                       
                        
                    }else{
                        let detalle2 = {
                            proveedor : compraActualizada.proveedor,
                            proyecto : compraActualizada.proyecto,
                            compra : compraActualizada._id,
                            producto : item.producto,
                            descripcion : item.descripcion,
                            precio : item.precio,
                            cantidad : parseInt(item.cantidad),                                       
                            estado: data.estado,
                            dia : today.getDate(),
                            mes : today.getMonth()+1,
                            year : today.getFullYear(),
                        }
                        
                        await Gasto_detalle.create(detalle2);
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

module.exports = {
    listar_proveedores_admin,    
    obtener_gastos_hoy,
    obtener_gastos_fechas,
    obtener_gasto_admin,
    generar_gasto_admin,
    obtener_gasto,
    compras_por_pagar_gastos,
    obtener_detalle_gasto,
    eliminar_detalle_gasto_admin,
    actualizar_gasto_admin
}