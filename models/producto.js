const mongoose = require('mongoose');

/*Definición del subdirectorio de los comentarios de un producto.*/

/*Subdocumentos:convertimos el esquema en una parte del otro. La principal diferencia entre un subdocumento y una 
relación entre documentos de colecciones diferentes es que el subdocumento queda dentro del documento principal y 
es diferente a cualquier otro objeto que pueda haber en  otro documento, aunque sus campos sean iguales*/

let comentarioSchema = new mongoose.Schema({
    nombreUsuario: {
        type: String,
        required: true,
        trim: true//limpia los espacios en blanco al inicio y final de los datos de texto
    },
    comentario: {
        type: String,
        required: true,
        minlength: 5
    }
});

// Definir esquema y modelo
let productoSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        minlength: 3,
        trim: true         
    },
    
    precio: {
        type: Number,
        required: true,
        min: 0
    },
    descripcion: {
        type: String,
        required: true,
        trim: true
    },
    imagen: {
        type: String
    },

    comentarios: [comentarioSchema]
});

let Producto = mongoose.model('producto', productoSchema);

module.exports = Producto;
