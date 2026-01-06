var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Configuracion_generalSchema = Schema({
    logo: {type: String, required: true},
    razon_social: {type: String, required: true},
    slogan: {type: String, required: true},
    background: {type: String, required: true},
    categoria: {type: String, required: true},
    tipo: {type: String, required: true},    
    
    updatedAt: {type: Date, default: Date.now, required: true},        
});

module.exports = mongoose.model('configuracion_general',Configuracion_generalSchema);