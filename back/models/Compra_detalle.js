var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Compra_detalleSchema = Schema({
    proveedor: {type: Schema.ObjectId, ref: 'proveedor', required: false},
    comprador: {type: Schema.ObjectId, ref: 'colaborador', required: false},
    compra: {type: Schema.ObjectId, ref: 'compra', required: false},
    venta: {type: Schema.Types.Mixed, ref: 'compra', required: false},
    producto: {type: Schema.ObjectId, ref: 'producto', required: false},
    variedad: {type: Schema.ObjectId, ref: 'variedad', required: false},
    titulo: {type: String, required: true},
    titulo_v: {type: String, required: true},
    precio: {type: Number, required: true},
    cantidad: {type: Number, required: true},
    dia: {type: String, required: true},
    mes: {type: String, required: true},
    year: {type: String, required: true},
    estado: {type: String, required: true},  

    creatdAt: {type: Date, default: Date.now, required : false},
});

module.exports = mongoose.model('compra_detalle',Compra_detalleSchema)