var Configuracion_general = require('../models/Configuracion_general');
var fs = require('fs');
var path = require('path');

const obtener_configuracion_general = async function(req,res){
    if(req.user){
        let config = await Configuracion_general.findById({_id:'656780f702cfb419a3507544'});
        res.status(200).send({data:config});
    }else{
        res.status(403).send({data:undefined,message:'NoToken'});
    }    
}

const actualizar_configuracion_general = async function(req,res){
    if(req.user){
        let id = '656780f702cfb419a3507544';
        let data = req.body;

        try {
            
            if (req.files) {
                //SI HAY IMAGEN
                var img_path = req.files.logo.path;
                var str_path = img_path.split('\\');
                var name = str_path[2];
               
                data.logo = name;
                let reg = await Configuracion_general.findByIdAndUpdate({_id:id},{
                    logo: data.logo,
                    razon_social: data.razon_social,
                    slogan: data.slogan,
                    background: data.background,
                    categoria: data.categoria,
                    tipo: data.tipo,
                    updatedAt : Date.now()
                });
                    res.status(200).send({data:reg});
            } else {
                let reg = await Configuracion_general.findByIdAndUpdate({_id:id},{
                    razon_social: data.razon_social,
                    slogan: data.slogan,
                    background: data.background,
                    categoria: data.categoria,
                    tipo: data.tipo,
                    updatedAt : Date.now()
                });
                res.status(200).send({data:reg});
            }

        } catch (error) {
            console.log(error);
            res.status(200).send({data:undefined,message:'Ocurrio un problema al registrar el curso.'})
        }
    }else{
        res.status(403).send({data:undefined,message:'NoToken'});
    }
}

const get_image_config = async function(req,res){
    var img = req.params['img'];

    fs.stat('./uploads/config/'+img, function(err){
        if(!err){
            let path_img = './uploads/config/'+img;
            res.status(200).sendFile(path.resolve(path_img));
        }else{
            let path_img = './uploads/default.jpg';
            res.status(200).sendFile(path.resolve(path_img));
        }
    });
}

module.exports = {
    obtener_configuracion_general,
    actualizar_configuracion_general,
    get_image_config
}