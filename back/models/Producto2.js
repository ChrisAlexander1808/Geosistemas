var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Producto2Schema = Schema ({
    codigo: {type: String, required: true},
    descripcion: {type: String, required: true},
    precio: {type: Number, required: true},
    tipo: {type: String, required: true},
    unidad: {type: String, required: true},

    createdAt: {type: Date, default: Date.now,required: true},    
});

module.exports = mongoose.model('producto2',Producto2Schema);