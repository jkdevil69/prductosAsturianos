const mongoose = require('mongoose');
let usuarioSchema = new mongoose.Schema({
    login: {
        type: String,
        required: true,
        minlength: 5,
        unique: true,
        trim: true
    
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
        trim: true
    },

    rol: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    }

    
});
let Usuario = mongoose.model('usuario', usuarioSchema);

module.exports = Usuario;