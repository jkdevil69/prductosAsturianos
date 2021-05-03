const express = require('express');
const sha256 = require('crypto-js/sha256');
const session = require('express-session');

let router = express.Router();
let Usuario = require(__dirname + '/../models/usuario.js');

router.use((req, res, next) => {
    res.locals.session = req.session;
    next();
});

router.use(
    session({
        secret: "1234",
        resave: true,
        saveUninitialized: false,
    })
);

router.get('/login', (req, res) => {
    res.render('auth_login');
});

router.get('/login_user', (req, res) => {
    res.render('auth_login');
});



router.post('/login',(req, res) => {
    Usuario.find({ login: req.body.login, password: sha256(req.body.password).toString() }).then(resultado => {
        if (resultado.length > 0) {
            console.log(resultado);
            req.session.login = resultado[0].login;
            req.session.rol = resultado[0].rol;
            res.redirect('/admin');
        } else {
            res.render('auth_login', { error: "Usuario incorrecto" });
        }
    }).catch(error => {
        res.render('admin_error');
    });
});

router.post('/login_user',(req, res) => {
    Usuario.find({ login: req.body.login, password: sha256(req.body.password).toString() }).then(resultado => {
        if (resultado.length > 0) {
            req.session.login = resultado[0].login;
            req.session.rol = resultado[0].rol;
            res.redirect('/user');
        } else {
            res.render('auth_login', { error: "Usuario incorrecto" });
        }
    }).catch(error => {
        res.render('admin_error');
    });
});


router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

module.exports = router;