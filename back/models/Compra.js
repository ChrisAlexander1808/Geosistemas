var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CompraSchema = Schema({
    proveedor: {type: Schema.ObjectId, ref: 'proveedor', required: true},
    comprador: {type: Schema.ObjectId, ref: 'colaborador', required: false},
    venta: {type: Schema.Types.Mixed, ref: 'venta', required: false},
    nit: {type: String, required: false},
    factura: {type: String, required: false},
    fechafactura: {type: String, required: false},
    observaciones: {type: String, required: false},
    documento: {type: String, required: false},
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

module.exports = mongoose.model('compra',CompraSchema)