var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var VentaSchema = Schema({
    cliente: {type: Schema.ObjectId, ref: 'cliente', required: false},
    asesor: {type: Schema.ObjectId, ref: 'colaborador', required: false},
    origen: {type: String, required: true},
    monto: {type: Number, required: true},
    saldo: {type: Number, required: true},
    canal: {type: String, required: true},
    dia: {type: String, required: true},
    mes: {type: String, required: true},
    year: {type: String, required: true},
    estado: {type: String, required: true},
    empresa: {type: String, required: true},
    correlativo: {type: Number, required: true, default: 1},
    vehiculo: {type: String, required: false},
    placa: {type: String, required: false},
    factura: {type: String, required: false},
    fechafactura: {type: String, required: false},
    createdAt: {type: Date, default: Date.now, required : false},
});

module.exports = mongoose.model('venta',VentaSchema)