var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var GastoSchema = Schema({
    proyecto: {type: Schema.ObjectId, ref: 'proyecto', required: false},
    proveedor: {type: Schema.ObjectId, ref: 'proveedor', required: true},
    factura: {type: String, required: false},
    fechafactura: {type: String, required: false},    
    categoria: {type: String, required: false},
    tipo: {type: String, required: false},
    monto: {type: Number, required: true},
    saldo: {type: Number, required: true},
    descuento: {type: Number, required: true},
    dia: {type: String, required: true},
    mes: {type: String, required: true},
    year: {type: String, required: true},
    estado: {type: String, required: true},
    correlativo: {type: Number, required: true, default: 1},
    
    createdAt: {type: Date, default: Date.now, required : false},
});

module.exports = mongoose.model('gasto',GastoSchema)