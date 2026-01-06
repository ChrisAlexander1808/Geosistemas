var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PagoSchema = Schema({
    /*cliente: {type: Schema.ObjectId, ref: 'cliente', required: false},
    vendedor: {type: Schema.ObjectId, ref: 'colaborador', required: false},

    proveedor: {type: Schema.ObjectId, ref: 'proveedor', required: false},
    comprador: {type: Schema.ObjectId, ref: 'colaborador', required: false},
    */
    cliente: {type: Schema.ObjectId, ref: 'proyecto', required: false},
    vendedor: {type: Schema.ObjectId, ref: 'colaborador', required: false},

    proveedor: {type: Schema.ObjectId, ref: 'proyecto', required: false},
    comprador: {type: Schema.ObjectId, ref: 'colaborador', required: false},

    compra: {type: Schema.ObjectId, ref: 'gasto', required: false},
    compra_detalle: {type: Schema.ObjectId, ref: 'gasto_detalle', required: false},

    venta: {type: Schema.ObjectId, ref: 'ingreso', required: false},
    venta_detalle: {type: Schema.ObjectId, ref: 'ingreso_detalle', required: false},

    monto: {type: Number, required: true},
    tipo: {type: String, required: true},
    metodo: {type: String, required: true},
    banco: {type: String, required: true},

    fecha: {type: String, required: true},
    transaccion: {type: String, required: true},
    estado: {type: String, required: true},
    correlativo: {type: Number, required: true},  
    
    createdAt: {type: Date, default: Date.now, required: true}        
});

module.exports = mongoose.model('pago',PagoSchema);