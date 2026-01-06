var Venta = require('../models/Venta');
var Compra = require('../models/Compra');
var Gasto = require('../models/Gasto')
var Pago = require('../models/Pago');
const Ingreso = require('../models/Ingreso');

const kpi_ventas_mensuales = async function (req, res) {
    if (req.user) {
        let today = new Date();
        let year = today.getFullYear();

        let firt = year+'-01-01';
        let last = year+'-12-31';
        
        var meses = [0,0,0,0,0,0,0,0,0,0,0,0];
        var meses_credito = [0,0,0,0,0,0,0,0,0,0,0,0];
        var meses_contado = [0,0,0,0,0,0,0,0,0,0,0,0];
        
        var ventas = await Ingreso.find({
            createdAt:{
                $gte: new Date(firt+'T00:00:00'),
                $lt: new Date(last+'T23:59:59')
            }
        });
        for(var item of ventas){
            let element_date = new Date(item.createdAt);
            let month_element = element_date.getMonth()+1;

            if (month_element == 1) {
                meses[0] = meses[0]+item.monto;
            } else if (month_element == 2) {
                meses[1] = meses[1]+item.monto;                
            } else if (month_element == 3) {
                meses[2] = meses[2]+item.monto;                
            } else if (month_element == 4) {
                meses[3] = meses[3]+item.monto;                
            } else if (month_element == 5) {
                meses[4] = meses[4]+item.monto;                
            } else if (month_element == 6) {
                meses[5] = meses[5]+item.monto;                
            } else if (month_element == 7) {
                meses[6] = meses[6]+item.monto;                
            } else if (month_element == 8) {
                meses[7] = meses[7]+item.monto;                
            } else if (month_element == 9) {
                meses[8] = meses[8]+item.monto;                
            } else if (month_element == 10) {
                meses[9] = meses[9]+item.monto;                
            } else if (month_element == 11) {
                meses[10] = meses[10]+item.monto;                
            } else if (month_element == 12) {
                meses[11] = meses[11]+item.monto;                
            }
        }

        var ventas_credito = await Ingreso.find({
            createdAt:{
                $gte: new Date(firt+'T00:00:00'),
                $lt: new Date(last+'T23:59:59')
            }, tipo:'Anticipo'
        });
        for(var item of ventas_credito){
            let element_date = new Date(item.createdAt);
            let month_element = element_date.getMonth()+1;

            if (month_element == 1) {
                meses_credito[0] = meses_credito[0]+item.monto;
            } else if (month_element == 2) {
                meses_credito[1] = meses_credito[1]+item.monto;                
            } else if (month_element == 3) {
                meses_credito[2] = meses_credito[2]+item.monto;                
            } else if (month_element == 4) {
                meses_credito[3] = meses_credito[3]+item.monto;                
            } else if (month_element == 5) {
                meses_credito[4] = meses_credito[4]+item.monto;                
            } else if (month_element == 6) {
                meses_credito[5] = meses_credito[5]+item.monto;                
            } else if (month_element == 7) {
                meses_credito[6] = meses_credito[6]+item.monto;                
            } else if (month_element == 8) {
                meses_credito[7] = meses_credito[7]+item.monto;                
            } else if (month_element == 9) {
                meses_credito[8] = meses_credito[8]+item.monto;                
            } else if (month_element == 10) {
                meses_credito[9] = meses_credito[9]+item.monto;                
            } else if (month_element == 11) {
                meses_credito[10] = meses_credito[10]+item.monto;                
            } else if (month_element == 12) {
                meses_credito[11] = meses_credito[11]+item.monto;                
            }
        }

        var ventas_contado = await Ingreso.find({
            createdAt:{
                $gte: new Date(firt+'T00:00:00'),
                $lt: new Date(last+'T23:59:59')
            }, tipo:'Estimacion'
        });
        for(var item of ventas_contado){
            let element_date = new Date(item.createdAt);
            let month_element = element_date.getMonth()+1;

            if (month_element == 1) {
                meses_contado[0] = meses_contado[0]+item.monto;
            } else if (month_element == 2) {
                meses_contado[1] = meses_contado[1]+item.monto;                
            } else if (month_element == 3) {
                meses_contado[2] = meses_contado[2]+item.monto;                
            } else if (month_element == 4) {
                meses_contado[3] = meses_contado[3]+item.monto;                
            } else if (month_element == 5) {
                meses_contado[4] = meses_contado[4]+item.monto;                
            } else if (month_element == 6) {
                meses_contado[5] = meses_contado[5]+item.monto;                
            } else if (month_element == 7) {
                meses_contado[6] = meses_contado[6]+item.monto;                
            } else if (month_element == 8) {
                meses_contado[7] = meses_contado[7]+item.monto;                
            } else if (month_element == 9) {
                meses_contado[8] = meses_contado[8]+item.monto;                
            } else if (month_element == 10) {
                meses_contado[9] = meses_contado[9]+item.monto;                
            } else if (month_element == 11) {
                meses_contado[10] = meses_contado[10]+item.monto;                
            } else if (month_element == 12) {
                meses_contado[11] = meses_contado[11]+item.monto;                
            }
        }
        
        res.status(200).send({data:meses,meses_credito,meses_contado});
    } else {
        res.status(403).send({data:undefined,message:'NoToken'});
    }
}

const kpi_compras_mensuales = async function (req, res) {
    if (req.user) {
        let today = new Date();
        let year = today.getFullYear();

        let firt = year+'-01-01';
        let last = year+'-12-31';
        
        var meses = [0,0,0,0,0,0,0,0,0,0,0,0];
        var meses_credito = [0,0,0,0,0,0,0,0,0,0,0,0];
        var meses_contado = [0,0,0,0,0,0,0,0,0,0,0,0];
        
        var compras = await Gasto.find({
            createdAt:{
                $gte: new Date(firt+'T00:00:00'),
                $lt: new Date(last+'T23:59:59')
            }
        });
        
        for(var item of compras){
            let element_date = new Date(item.createdAt);
            let month_element = element_date.getMonth()+1;

            if (month_element == 1) {
                meses[0] = meses[0]+item.monto;
            } else if (month_element == 2) {
                meses[1] = meses[1]+item.monto;                
            } else if (month_element == 3) {
                meses[2] = meses[2]+item.monto;                
            } else if (month_element == 4) {
                meses[3] = meses[3]+item.monto;                
            } else if (month_element == 5) {
                meses[4] = meses[4]+item.monto;                
            } else if (month_element == 6) {
                meses[5] = meses[5]+item.monto;                
            } else if (month_element == 7) {
                meses[6] = meses[6]+item.monto;                
            } else if (month_element == 8) {
                meses[7] = meses[7]+item.monto;                
            } else if (month_element == 9) {
                meses[8] = meses[8]+item.monto;                
            } else if (month_element == 10) {
                meses[9] = meses[9]+item.monto;                
            } else if (month_element == 11) {
                meses[10] = meses[10]+item.monto;                
            } else if (month_element == 12) {
                meses[11] = meses[11]+item.monto;                
            }
        }

        var compras_credito = await Gasto.find({
            createdAt:{
                $gte: new Date(firt+'T00:00:00'),
                $lt: new Date(last+'T23:59:59')
            }, tipo:'Credito'
        });
        for(var item of compras_credito){
            let element_date = new Date(item.createdAt);
            let month_element = element_date.getMonth()+1;

            if (month_element == 1) {
                meses_credito[0] = meses_credito[0]+item.monto;
            } else if (month_element == 2) {
                meses_credito[1] = meses_credito[1]+item.monto;                
            } else if (month_element == 3) {
                meses_credito[2] = meses_credito[2]+item.monto;                
            } else if (month_element == 4) {
                meses_credito[3] = meses_credito[3]+item.monto;                
            } else if (month_element == 5) {
                meses_credito[4] = meses_credito[4]+item.monto;                
            } else if (month_element == 6) {
                meses_credito[5] = meses_credito[5]+item.monto;                
            } else if (month_element == 7) {
                meses_credito[6] = meses_credito[6]+item.monto;                
            } else if (month_element == 8) {
                meses_credito[7] = meses_credito[7]+item.monto;                
            } else if (month_element == 9) {
                meses_credito[8] = meses_credito[8]+item.monto;                
            } else if (month_element == 10) {
                meses_credito[9] = meses_credito[9]+item.monto;                
            } else if (month_element == 11) {
                meses_credito[10] = meses_credito[10]+item.monto;                
            } else if (month_element == 12) {
                meses_credito[11] = meses_credito[11]+item.monto;                
            }
        }

        var compras_contado = await Gasto.find({
            createdAt:{
                $gte: new Date(firt+'T00:00:00'),
                $lt: new Date(last+'T23:59:59')
            }, tipo:'Contado'
        });
        for(var item of compras_contado){
            let element_date = new Date(item.createdAt);
            let month_element = element_date.getMonth()+1;

            if (month_element == 1) {
                meses_contado[0] = meses_contado[0]+item.monto;
            } else if (month_element == 2) {
                meses_contado[1] = meses_contado[1]+item.monto;                
            } else if (month_element == 3) {
                meses_contado[2] = meses_contado[2]+item.monto;                
            } else if (month_element == 4) {
                meses_contado[3] = meses_contado[3]+item.monto;                
            } else if (month_element == 5) {
                meses_contado[4] = meses_contado[4]+item.monto;                
            } else if (month_element == 6) {
                meses_contado[5] = meses_contado[5]+item.monto;                
            } else if (month_element == 7) {
                meses_contado[6] = meses_contado[6]+item.monto;                
            } else if (month_element == 8) {
                meses_contado[7] = meses_contado[7]+item.monto;                
            } else if (month_element == 9) {
                meses_contado[8] = meses_contado[8]+item.monto;                
            } else if (month_element == 10) {
                meses_contado[9] = meses_contado[9]+item.monto;                
            } else if (month_element == 11) {
                meses_contado[10] = meses_contado[10]+item.monto;                
            } else if (month_element == 12) {
                meses_contado[11] = meses_contado[11]+item.monto;                
            }
        }
        
        res.status(200).send({data:meses,meses_credito,meses_contado});
    } else {
        res.status(403).send({data:undefined,message:'NoToken'});
    }
}

const kpi_total_ventas = async function(req,res){
    if (req.user) {
        let today = new Date();
        let year = today.getFullYear();

        let firt = year+'-01-01';
        let last = year+'-12-31';

        var total_venta = 0;
        var total_venta_credito = 0;
        var total_venta_contado = 0;

        var ventas = await Ingreso.find({
            createdAt:{
                $gte: new Date(firt+'T00:00:00'),
                $lt: new Date(last+'T23:59:59')
            }
        });    
        for(var item of ventas){
            total_venta = total_venta + item.monto;
        }

        var ventas_credito = await Ingreso.find({
            createdAt:{
                $gte: new Date(firt+'T00:00:00'),
                $lt: new Date(last+'T23:59:59')
            }, tipo:'Anticipo'
        });    
        for(var item of ventas_credito){
            total_venta_credito = total_venta_credito + item.monto;
        }

        var ventas_contado = await Ingreso.find({
            createdAt:{
                $gte: new Date(firt+'T00:00:00'),
                $lt: new Date(last+'T23:59:59')
            }, tipo:'Estimacion'
        });    
        for(var item of ventas_contado){
            total_venta_contado = total_venta_contado + item.monto;
        }
        
        res.status(200).send({data:total_venta,total_venta_credito,total_venta_contado});
    }else{
        res.status(403).send({data:undefined,message:'NoToken'});
    }
}

const kpi_pagos_tipo = async function (req, res) {
    if (req.user){
        var year = req.params['year'];
        var month = req.params['month'];

        let inicio = year+'-'+month+'-01';
        let hasta = new Date(year+'-'+month+'-01T00:00:00');
        hasta.setDate(hasta.getDate()+30)

        var monto_compras = 0;
        var monto_ventas = 0;
       
        var pagos_compras = await Pago.find({createdAt:{
            $gte : new Date(inicio+'T00:00:00'),
            $lt : new Date(hasta)
        }, tipo:'Compras'});

        for(var item of pagos_compras){
            monto_compras = monto_compras + item.monto;
        }

        var pagos_ventas = await Pago.find({createdAt:{
            $gte : new Date(inicio+'T00:00:00'),
            $lt : new Date(hasta)
        }, tipo:'Ventas'});

        for(var item of pagos_ventas){
            monto_ventas = monto_ventas + item.monto;
        }
        
        res.status(200).send({data:[monto_ventas,monto_compras]});
    }else{
        res.status(403).send({data:undefined,message:'NoToken'});
    }
}

module.exports = {
    kpi_ventas_mensuales,
    kpi_compras_mensuales,
    kpi_total_ventas,
    kpi_pagos_tipo
}