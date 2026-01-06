var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ProyectoSchema = Schema ({
    cliente: {type: Schema.ObjectId, ref: 'cliente', required: true},
    nombre: {type: String, required: true},
    ubicacion: {type: String, required: true},
    fechainicio: {type: Date, required: true},
    valor: {type: Number, required: true},    
    estado: {type: String, required: true},
    ingresos: {type: Number, require: false},
    gastos: {type: Number, require: false},

    createdAt: {type: Date, default: Date.now,required: true},    
});

module.exports = mongoose.model('proyecto',ProyectoSchema);