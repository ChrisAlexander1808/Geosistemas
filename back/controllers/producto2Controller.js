var Producto2 = require('../models/Producto2');

const registrar_producto2_admin = async function (req,res) {
    if(req.user){
        let data = req.body;
        let producto = await Producto2.create(data);
        
        res.status(200).send({data:producto});
    }else{
        res.status(403).send({data:undefined,message:'Notoken'});
    }
}

const listar_producto2_admin = async function(req,res){
     if(req.user){
         let productos = await Producto2.find();
         res.status(200).send({data:productos});
     }else{
         res.status(403).send({data:undefined,message:'Notoken'});
     }
 }

const eliminar_producto_admin = async function(req,res){
    if(req.user){
        let id = req.params['id'];
        let producto = await Producto2.findByIdAndRemove({_id:id});      
            res.status(200).send({data:producto}); 
       
    }else{
        res.status(403).send({data:undefined,message:'NoToken'});
    }
}

const actualizar_producto2_admin = async function(req,res){
    if (req.user) {
        let id = req.params['id'];
        let data = req.body;
    
        let producto = await Producto2.findByIdAndUpdate({_id:id},{
            codigo: data.codigo,
            descripcion: data.descripcion,
            precio: data.precio,
            tipo: data.tipo,
            unidad: data.unidad,
        });
        res.status(200).send({data:producto});
    } else {
        res.status(403).send({data:undefined,message:"NoToken"});
    }
}

const obtener_producto2_admin = async function(req,res){
    if(req.user){
        let id = req.params['id'];

        let producto = await Producto2.findById({_id:id});
        res.status(200).send({data:producto});
    }else{
        res.status(403).send({data:undefined,message:'Notoken'});
    }
}

 module.exports = {
    registrar_producto2_admin,
    listar_producto2_admin,
    eliminar_producto_admin,
    obtener_producto2_admin,
    actualizar_producto2_admin
 }
 