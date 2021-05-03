const mongoose = require('mongoose');
const Usuario = require(__dirname + '/../models/usuario');
const sha256 = require('crypto-js/sha256');

mongoose.connect('mongodb://localhost:27017/ProdAsturianosV3');

Usuario.collection.drop();

let usu1 = new Usuario({
    login: 'may',
    password: sha256('1234').toString(),
    rol:'admin'
});
usu1.save();

let usu2 = new Usuario({
    login: 'nacho',
    password: sha256('5678').toString(),
    rol: 'admin'
});
usu2.save();

let usu3 = new Usuario({
    login: 'juancarlos',
    password: sha256('juancarlos').toString(),
    rol:'admin'
});
usu3.save();

let usu4 = new Usuario({
    login: 'manolokabezabolo',
    password: sha256('manolokabezabolo').toString(),
    rol:'user'
});
usu4.save();

let usu5 = new Usuario({
    login: 'goldorak',
    password: sha256('goldorak').toString(),
    rol:'user'
});
usu5.save();

let usu6 = new Usuario({
    login: 'nachomanuel',
    password: sha256('12345678').toString(),
    rol:'user'
});
usu6.save();