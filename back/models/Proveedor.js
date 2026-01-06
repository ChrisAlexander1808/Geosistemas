var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ProveedorSchema = Schema({
    nombrecomercial: {type: String, required: true},
    razonsocial: {type: String, required: true},
    nit: {type: String, required: true},
    direccion: {type: String, required: false},
    email: {type: String, required: false},    
    telefono: {type: String, required: true},
    estado: {type: Boolean,default: true, required: true},
    diascredito: {type: Number, required: false},
    comprador: {type: Schema.ObjectId, ref: 'colaborador', required: false},
    createAt: {type: Date, default: Date.now, required: true},        
});

module.exports = mongoose.model('proveedor',ProveedorSchema);