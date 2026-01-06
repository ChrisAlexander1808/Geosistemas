var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Gasto_detalleSchema = Schema({
    proveedor: {type: Schema.ObjectId, ref: 'proveedor', required: false},
    proyecto: {type: Schema.ObjectId, ref: 'proyecto', required: false},
    compra: {type: Schema.ObjectId, ref: 'compra', required: false},
    producto: {type: Schema.ObjectId, ref: 'producto2', required: false},
    descripcion: {type: String, required: true},
    precio: {type: Number, required: true},
    cantidad: {type: Number, required: true},
    dia: {type: String, required: true},
    mes: {type: String, required: true},
    year: {type: String, required: true},
    estado: {type: String, required: true},  

    creatdAt: {type: Date, default: Date.now, required : false},
});

module.exports = mongoose.model('gasto_detalle',Gasto_detalleSchema)