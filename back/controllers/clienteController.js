var Cliente = require('../models/Cliente');
var bcrypt = require('bcrypt-nodejs');
var jwt_cliente = require('../helpers/jwt-cliente');
var jwt = require('jwt-simple');

var fs = require('fs');
var handlebars = require('handlebars');
var ejs = require('ejs');
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var path = require('path');

//Este método lo exportamos para la ruta que debe crearse en cliente.js
const registro_cliente_admin = async function(req,res){
    if (req.user) {
        let data = req.body;
    try {

        bcrypt.hash('123456789',null,null, async function(err,hash){
            if (err) {
                res.status(200).send({data:undefined,message:"No se pudo generar la contraseña"});
            } else {               
                    data.password = hash;
                    let cliente = await Cliente.create(data);
                    res.status(200).send({data:cliente});
                
            }
        })
        

    } catch (error) {
        console.log(error);
        res.status(200).send({data:undefined,message:"verifique los campos del formulario"});
    }
    } else {
        res.status(403).send({data:undefined,message:"NoToken"});
    }
}

const enviar_correo_verificacion = async function(email){
    var readHTMLFile = function(path, callback) {
        fs.readFile(path, {encoding: 'utf-8'}, function (err, html) {
            if (err) {
                throw err;
                callback(err);
            }
            else {
                callback(null, html);
            }
        });
    };
    
    var transporter = nodemailer.createTransport(smtpTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        auth: {
            user: 'gchristofer18@gmail.com',
            pass: 'fxssinhcivdbirju'
        }
    }));
    
    //OBTENER CLIENTE
    var cliente = await Cliente.findOne({email:email});
    var token = jwt_cliente.createToken(cliente);

    readHTMLFile(process.cwd() + '/mails/account_verify.html', (err, html)=>{
                        
        let rest_html = ejs.render(html, {token: token});
    
        var template = handlebars.compile(rest_html);
        var htmlToSend = template({op:true});
    
        var mailOptions = {
            from: 'gchristofer18@gmail.com',
            to: email,
            subject: 'Verificación de cuenta',
            html: htmlToSend
        };
      
        transporter.sendMail(mailOptions, function(error, info){
            if (!error) {
                console.log('Email sent: ' + info.response);
            }
        });
    
    });
}

const validar_correo_verificacion = async function(req,res){
    var token_params = req.params['token'];
    var token = token_params.replace(/['']+/g,'');
    //HEADER
    //PAYLOAD
    //FIRMA
    var segment = token.split('.');
    if(segment.length != 3){
        return res.status(403).send({message:'InvalidToken'});
    }else{
        try {
            var payload = jwt.decode(token,'chris1808');
            await Cliente.findByIdAndUpdate({_id:payload.sub},{
                verify: true
            })
            res.status(200).send({data:true});
        } catch (error) {
            console.log(error);
            return res.status(200).send({message:'El correo de verificación expiró',data:undefined});
        }
    }
}

const listar_clientes_admin = async function(req,res){
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
        let clientes = await Cliente.find();
        res.status(200).send({data:clientes});
    }else{
        res.status(403).send({data:undefined,message:'Notoken'});
    }
}

const obtener_datos_cliente_admin = async function(req,res){
    if(req.user){
        let id = req.params['id'];
        try {
            let cliente = await Cliente.findById({_id:id}).populate('asesor');
            res.status(200).send({data:cliente});
        } catch (error) {
            res.status(200).send({data:undefined});
        }
    }else{
        res.status(403).send({data:undefined,message:'NoToken'});
    }
}

const editar_cliente_admin = async function(req,res){
    if (req.user) {
        let id = req.params['id'];
        let data = req.body;
    
        let cliente = await Cliente.findByIdAndUpdate({_id:id},{
            nombrecomercial: data.nombrecomercial,
            razonsocial: data.razonsocial,
            nit: data.nit,
            direccion: data.direccion,
            email: data.email,            
            telefono: data.telefono,
            tipo: data.tipo,
        });
        res.status(200).send({data:cliente});
    } else {
        res.status(403).send({data:undefined,message:"NoToken"});
    }
}

const cambiar_estado_cliente_admin = async function(req,res){
    if (req.user) {
        let id = req.params['id'];
        let data = req.body;

        let nuevo_estado;

        if(data.estado){
            nuevo_estado = false;
        }else if (!data.estado) {
            nuevo_estado = true;
        }
        let cliente = await Cliente.findByIdAndUpdate({_id:id},{
            estado: nuevo_estado
        });
        res.status(200).send({data:cliente});
    }else{
        res.status(403).send({data:undefined,message:'NoToken'});
    }
}

const listar_clientes_modal_admin = async function(req,res){
    if(req.user){
        let filtro = req.params['filtro'];
        let clientes = await Cliente.find({
            $or: [
                {nombrecomercial: new RegExp(filtro,'i')},
                {razonsocial: new RegExp(filtro,'i')},
                {nit: new RegExp(filtro,'i')},
                {direccion: new RegExp(filtro,'i')},
                {email: new RegExp(filtro,'i')}
            ]
        });
        res.status(200).send({data:clientes});
    }else{
        res.status(403).send({data:undefined,message:'Notoken'});
    }
}

module.exports = {
    registro_cliente_admin,
    validar_correo_verificacion,
    listar_clientes_admin,
    obtener_datos_cliente_admin,
    editar_cliente_admin,
    cambiar_estado_cliente_admin,
    listar_clientes_modal_admin
}