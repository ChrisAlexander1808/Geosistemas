var Proveedor = require('../models/Proveedor');

const registro_proveedor_admin = async function(req,res){
    if (req.user) {
        let data = req.body;

        try {
            let proveedores = await Proveedor.find({nombrecomercial:data.nombrecomercial});

            if (proveedores.length >= 1) {
                res.status(200).send({data:undefined,message:'Ya existe un proveedor con ese nombre'});
            } else {               
                let pro = await Proveedor.create(data);
                res.status(200).send({data:pro});
            }
        } catch (error) {
            console.log(error);
            res.status(200).send({data:undefined,message:'Ocurrio un problema al registrar el producto'});
        }       
    } else {
        res.status(403).send({data:undefined,message:'NoToken'});
    }
}

const listar_proveedores_admin = async function(req,res){
    /*
    if(req.user){
         let filtro = req.params['filtro'];
         let clientes = await Cliente.find({
             $or: [
                 {nombres: new RegExp(filtro,'i')},
                 {apellidos: new RegExp(filtro,'i')},
                 {n_doc: new RegExp(filtro,'i')},
                 {email: new RegExp(filtro,'i')},
                 {fullname: new RegExp(filtro,'i')}
             ]
         });
         res.status(200).send({data:clientes});
     }else{
         res.status(403).send({data:undefined,message:'Notoken'});
     }
    */  
     if(req.user){
         let proveedores = await Proveedor.find();
         res.status(200).send({data:proveedores});
     }else{
         res.status(403).send({data:undefined,message:'Notoken'});
     }
 }

 const obtener_datos_proveedor_admin = async function(req,res){
    if(req.user){
        let id = req.params['id'];
        try {
            let proveedor = await Proveedor.findById({_id:id}).populate('comprador');
            res.status(200).send({data:proveedor});
        } catch (error) {
            res.status(200).send({data:undefined});
        }
    }else{
        res.status(403).send({data:undefined,message:'NoToken'});
    }
}

const editar_proveedor_admin = async function(req,res){
    if (req.user) {
        let id = req.params['id'];
        let data = req.body;
    
        let proveedor = await Proveedor.findByIdAndUpdate({_id:id},{
            nombrecomercial: data.nombrecomercial,
            razonsocial: data.razonsocial,
            nit: data.nit,
            direccion: data.direccion,
            diascredito: data.diascredito,
            email: data.email,            
            telefono: data.telefono,
        });
        res.status(200).send({data:proveedor});
    } else {
        res.status(403).send({data:undefined,message:"NoToken"});
    }
}

const cambiar_estado_proveedor_admin = async function(req,res){
    if (req.user) {
        let id = req.params['id'];
        let data = req.body;

        let nuevo_estado;

        if(data.estado){
            nuevo_estado = false;
        }else if (!data.estado) {
            nuevo_estado = true;
        }
        let proveedor = await Proveedor.findByIdAndUpdate({_id:id},{
            estado: nuevo_estado
        });
        res.status(200).send({data:proveedor});
    }else{
        res.status(403).send({data:undefined,message:'NoToken'});
    }
}

const listar_proveedores_modal_admin = async function(req,res){
    if(req.user){
        let filtro = req.params['filtro'];
        let proveedor = await Proveedor.find({
            $or: [
                {nombrecomercial: new RegExp(filtro,'i')},
                {razonsocial: new RegExp(filtro,'i')},
                {nit: new RegExp(filtro,'i')},
                {direccion: new RegExp(filtro,'i')},
                {email: new RegExp(filtro,'i')}
            ]
        });
        res.status(200).send({data:proveedor});
    }else{
        res.status(403).send({data:undefined,message:'Notoken'});
    }
}

module.exports = {
    registro_proveedor_admin,
    listar_proveedores_admin,
    obtener_datos_proveedor_admin,
    editar_proveedor_admin,
    cambiar_estado_proveedor_admin,
    listar_proveedores_modal_admin
}