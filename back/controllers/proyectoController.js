var Proyecto = require('../models/Proyecto');   
var Gasto = require('../models/Gasto');
const { ObjectId } = require('mongodb');
const { default: mongoose } = require('mongoose');
const Pago = require('../models/Pago');
var fs = require('fs');
var path = require('path');

const ingresar_proyecto_admin = async function (req,res) {
    if(req.user){
        let data = req.body;
        
        try {
            let proyecto = await Proyecto.find({nombre:data.nombre});

            if (proyecto.length >= 1) {
                res.status(200).send({data:undefined,message:'Ya existe un proyecto con ese nombre'})
            } else {   
                data.ingresos = 0;             
                data.gastos = 0;
                let reg = await Proyecto.create(data);
                res.status(200).send({data:reg});
            }
        } catch (error) {
            console.log(error);
            res.status(200).send({data:undefined,message:'Ocurrio un problema al registrar el producto'});
        }       
    } else {
        res.status(403).send({data:undefined,message:'NoToken'});
    }
}

const listar_proyectos_admin = async function(req,res) { 
     if(req.user){
         let proyectos = await Proyecto.find().populate('cliente').sort({createdAt:-1});
         res.status(200).send({data:proyectos});
     }else{
         res.status(403).send({data:undefined,message:'Notoken'});
     }
}

const actualizar_proyecto_admin = async function(req,res){
    if (req.user) {
        let id = req.params['id'];
        let data = req.body;
    
        let proyecto = await Proyecto.findByIdAndUpdate({_id:id},{
            cliente: data.cliente,
            nombre: data.nombre,
            ubicacion: data.ubicacion,
            fechainicio: data.fechainicio,
            valor: data.valor,
            estado: data.estado,
        });
        res.status(200).send({data:proyecto});
    } else {
        res.status(403).send({data:undefined,message:"NoToken"});
    }
}

const obtener_proyecto_admin = async function(req,res){
    if(req.user){
        let id = req.params['id'];

        let proyecto = await Proyecto.findById({_id:id}).populate('cliente');
        res.status(200).send({data:proyecto});
    }else{
        res.status(403).send({data:undefined,message:'Notoken'});
    }
}

const eliminar_proyecto_admin = async function(req,res){
    if(req.user){
        let id = req.params['id'];
        let proyecto = await Proyecto.findByIdAndRemove({_id:id});      
            res.status(200).send({data:proyecto}); 
       
    }else{
        res.status(403).send({data:undefined,message:'NoToken'});
    }
}

const obtener_datos_categorias = async function(req, res){
    if(req.user){
        let id = req.params['id'];
        const result = await Gasto.aggregate([
            { $match: { proyecto: new mongoose.Types.ObjectId(id)}},
            { $group: { _id: "$categoria",
                        cantidadGastos: { $sum : 1},
                        montoTotal: { $sum: "$monto"},
                        saldoTotal: { $sum: "$saldo"}
                }}
        ]);
        res.status(200).send({data:result});
    }else{
        res.status(403).send({data:undefined,message:'NoToken'})
    }
}

const kpi_gastos_categoria = async function (req, res) {
    if (req.user){
        let id = req.params['id'];
        
        var muro = 0;
        var geomalla = 0;
        var fletes = 0;
        var maquinaria = 0;
        var planilla = 0;
        var materiales_Extras = 0;
        var otros = 0;
       
        var gastosmuro = await Gasto.find({proyecto:id, categoria:'Muro'});

        for(var item of gastosmuro){
            muro = muro + item.monto;
        }

        var gastosgeo = await Gasto.find({proyecto:id, categoria:'Geomalla'});

        for(var item of gastosgeo){
            geomalla = geomalla + item.monto;
        }

        var gastosflete = await Gasto.find({proyecto:id, categoria:'Fletes'});

        for(var item of gastosflete){
            fletes = fletes + item.monto;
        }

        var gastosmaqui = await Gasto.find({proyecto:id, categoria:'Maquinaria'});

        for(var item of gastosmaqui){
            maquinaria = maquinaria + item.monto;
        }

        var gastosplani = await Gasto.find({proyecto:id, categoria:'Planilla'});

        for(var item of gastosplani){
            planilla = planilla + item.monto;
        }

        var gastosmatex = await Gasto.find({proyecto:id, categoria:'Materiales Extras'});

        for(var item of gastosmatex){
            materiales_Extras = materiales_Extras + item.monto;
        }

        var gastosotros = await Gasto.find({proyecto:id, categoria:'Otros'});

        for(var item of gastosotros){
            otros = otros + item.monto;
        }
        
        res.status(200).send({data:[muro,geomalla,fletes,maquinaria,planilla,materiales_Extras,otros]});
    }else{
        res.status(403).send({data:undefined,message:'NoToken'});
    }
}

const obtener_ingresos_proyecto = async function(req, res){
    if (req.user) {
        let id = req.params['id'];
        const pagos = await Pago.find({cliente:id}).populate({path: 'venta', select: 'archivoPDF tipo'}).populate('cliente');

        res.status(200).send({data:pagos});
    }else{
        res.status(403).send({data:undefined,message:'NoToken'})
    }
}

const get_pdf = (req, res) => {
    var archivoPDF = req.params['archivoPDF'];
    
    fs.stat('./uploads/facturas/'+archivoPDF, function(err){
        if(!err){
            let path_arch = './uploads/facturas/'+archivoPDF;
            res.status(200).sendFile(path.resolve(path_arch));
        }else{
            let path_arch = './uploads/default.jpg';
            res.status(200).sendFile(path.resolve(path_arch));
        }
    });
};

const obtener_listado_gastos = async function(req, res){
    if (req.user) {
        let id = req.params['id'];
        let categoria = req.params['categoria'];

        const listado_gastos = await Gasto.find({proyecto:id,categoria:categoria}).populate('proveedor');

        res.status(200).send({data:listado_gastos});
    } else {
        res.status(403).send({data:undefined,message:'NoToken'});
    }
}

module.exports = {
    ingresar_proyecto_admin,
    listar_proyectos_admin,
    obtener_proyecto_admin,
    actualizar_proyecto_admin,
    eliminar_proyecto_admin,
    obtener_datos_categorias,
    kpi_gastos_categoria,
    obtener_ingresos_proyecto,
    obtener_listado_gastos,
    get_pdf
}