var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var IngresoSchema = Schema({
    cliente: {type: Schema.ObjectId, ref: 'cliente', required: false},
    proyecto: {type: Schema.ObjectId, ref: 'proyecto', required: false},
    monto: {type: Number, required: true},
    saldo: {type: Number, required: true},
    tipo: {type: String, required: true},
    dia: {type: String, required: true},
    mes: {type: String, required: true},
    year: {type: String, required: true},
    estado: {type: String, required: true},
    correlativo: {type: Number, required: true, default: 1},
    factura: {type: String, required: false},
    fechafactura: {type: String, required: false},
    archivoPDF: {type: String, required: false},
    createdAt: {type: Date, default: Date.now, required : false},
});

module.exports = mongoose.model('ingreso',IngresoSchema)