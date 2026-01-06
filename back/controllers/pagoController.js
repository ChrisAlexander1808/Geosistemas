var Pago = require('../models/Pago');
const Compra = require('../models/Compra');
const Proyecto = require('../models/Proyecto');
const Ingreso = require('../models/Ingreso');
const Gasto = require('../models/Gasto');
const Venta = require('../models/Venta');

const obtener_pago_vc_admin = async function(req,res){
    if (req.user) {   
        let id = req.params['id'];
        try {     
                let pagoscompras = [];
                pagoscompras = await Pago.find({compra:id}).populate({
                    path: 'compra_detalle',
                    populate: {
                        path: 'producto variedad'
                    }, 
                });                
                let pagosventas = [];
                pagosventas = await Pago.find({venta:id}).populate({
                    path: 'venta_detalle',
                    populate: {
                        path: 'producto variedad'
                    }
                });
                if (pagoscompras.length >=1) {
                    res.status(200).send({data:pagoscompras});
                } else {
                    res.status(200).send({data:pagosventas});
                }    
          
        } catch (error) {
            res.status(200).send({data:undefined});
        }
    }else{
        res.status(403).send({data:undefined,message:'NoToken'});
    }
}

const obtener_pagos_general = async function(req,res){
        if (req.user) {
            let pagosgeneral = await Pago.find();

            res.status(200).send({data:pagosgeneral});
        } else {
            
        }
}

const crear_pagocompra_admin = async function(req,res) {
    if (req.user) {
        
        let data = req.body;
        data.comprador = req.user.sub;
        data.estado = 'Aprobado';   

        if (data.destino_pago != 'Compra') {
            data.compra_detalle = data.destino_pago;    
        }           
        
        let pagos = await Pago.find().sort({createdAt:-1});

        if (pagos.length == 0) {
            data.correlativo = 1;
            let pago = await Pago.create(data);  
            
            disminuir_saldocompra_admin(data.compra,data.monto);

            res.status(200).send({data:pago});
        } else {
            let last_correlativo = pagos[0].correlativo;
            data.correlativo = last_correlativo + 1;
            let pago = await Pago.create(data);
            
            disminuir_saldocompra_admin(data.compra,data.monto);

            res.status(200).send({data:pago});
        }
    } else {
        res.status(403).send({data:undefined,message:'NoToken'});
    }
}

const crear_pagoventa_admin = async function(req,res){
    if (req.user) {
        
        let data = req.body;
        data.vendedor = req.user.sub;
        data.estado = 'Aprobado';   

        if (data.destino_pago != 'Venta') {
            data.venta_detalle = data.destino_pago;    
        }         
                
        let pagos = await Pago.find().sort({createdAt:-1});

        if (pagos.length == 0) {
            data.correlativo = 1;
            let pagoventa = await Pago.create(data);

            disminuir_saldov_admin(data.venta,data.monto);
            res.status(200).send({data:pagoventa});

        } else {
            let last_correlativo = pagos[0].correlativo;
            data.correlativo = last_correlativo + 1;
            let pagoventa = await Pago.create(data);

            
            disminuir_saldov_admin(data.venta,data.monto);
            res.status(200).send({data:pagoventa});
        }
    } else {
        res.status(403).send({data:undefined,message:'NoToken'});
    }
}

const crear_pagovingreso_admin = async function(req,res){
    if (req.user) {
        
        let data = req.body;
        data.vendedor = req.user.sub;
        data.estado = 'Aprobado';   

        if (data.destino_pago != 'Venta') {
            data.venta_detalle = data.destino_pago;    
        }         
                
        let pagos = await Pago.find().sort({createdAt:-1});

        if (pagos.length == 0) {
            data.correlativo = 1;
            let pagoventa = await Pago.create(data);

            aumentar_ingreso_proyecto(data.cliente,data.monto);
            disminuir_saldoventa_admin(data.venta,data.monto);
            res.status(200).send({data:pagoventa});

        } else {
            let last_correlativo = pagos[0].correlativo;
            data.correlativo = last_correlativo + 1;
            let pagoventa = await Pago.create(data);

            aumentar_ingreso_proyecto(data.cliente,data.monto);
            disminuir_saldoventa_admin(data.venta,data.monto);
            res.status(200).send({data:pagoventa});
        }
    } else {
        res.status(403).send({data:undefined,message:'NoToken'});
    }
}

const crear_pagogasto_admin = async function(req,res){
    if (req.user) {
        
        let data = req.body;
        data.comprador = req.user.sub;
        data.estado = 'Aprobado';   

        if (data.destino_pago != 'Compra') {
            data.compra_detalle = data.destino_pago;    
        }         
                
        let pagos = await Pago.find().sort({createdAt:-1});

        if (pagos.length == 0) {
            data.correlativo = 1;
            let pagocompra = await Pago.create(data);
           
            disminuir_saldocompra_admin(data.compra,data.monto);
            res.status(200).send({data:pagocompra});

        } else {
            let last_correlativo = pagos[0].correlativo;
            data.correlativo = last_correlativo + 1;
            let pagocompra = await Pago.create(data);
            
            disminuir_saldocompra_admin(data.compra,data.monto);
            res.status(200).send({data:pagocompra});
        }
    } else {
        res.status(403).send({data:undefined,message:'NoToken'});
    }
}

const obtener_pago_ig_admin = async function(req,res){
    if (req.user) {   
        let id = req.params['id'];
        try {     
                let pagoscompras = await Pago.find({compra:id});                
            
                let pagosventas = await Pago.find({venta:id});

                if (pagoscompras.length >=1) {
                    res.status(200).send({data:pagoscompras});
                } else {
                    res.status(200).send({data:pagosventas});
                }    
          
        } catch (error) {
            res.status(200).send({data:undefined});
        }
    }else{
        res.status(403).send({data:undefined,message:'NoToken'});
    }
}

const disminuir_saldocompra_admin = async function(id,monto){
    //saldo compra
    let gasto = await Gasto.findById({_id:id});
    let nuevo_saldo_actual = gasto.saldo - parseInt(monto);
    await Gasto.findByIdAndUpdate({_id:id},{
        saldo : nuevo_saldo_actual
    });
    if(nuevo_saldo_actual == 0){
        await Gasto.findByIdAndUpdate({_id:id},{
            estado: 'Cancelado'
        });
    }
}

const disminuir_saldoventa_admin = async function(id,monto){
    //saldo venta
    let ingreso = await Ingreso.findById({_id:id});
    let nuevo_saldo_actual = ingreso.saldo - parseFloat(monto);
    await Ingreso.findByIdAndUpdate({_id:id},{
        saldo : nuevo_saldo_actual
    });
    if(nuevo_saldo_actual == 0){
        await Ingreso.findByIdAndUpdate({_id:id},{
            estado: 'Cancelado'
        });
    }
}

const disminuir_saldov_admin = async function(id,monto){
    //saldo venta
    let venta = await Venta.findById({_id:id});
    let nuevo_saldo_actual = venta.saldo - parseFloat(monto);
    await Venta.findByIdAndUpdate({_id:id},{
        saldo : nuevo_saldo_actual
    });
    if(nuevo_saldo_actual == 0){
        await Venta.findByIdAndUpdate({_id:id},{
            estado: 'Cancelado'
        });
    }
}

const aumentar_ingreso_proyecto = async function(idx,ingreso){

    let proyecto = await Proyecto.findById(idx);
    let nuevo_ingreso = proyecto.ingresos + parseInt(ingreso);
    await Proyecto.findByIdAndUpdate(idx, {        
        ingresos : nuevo_ingreso
    });
}


module.exports = {
    crear_pagocompra_admin,
    crear_pagoventa_admin,
    obtener_pago_vc_admin,
    obtener_pagos_general,
    crear_pagovingreso_admin,
    crear_pagogasto_admin,
    obtener_pago_ig_admin
}