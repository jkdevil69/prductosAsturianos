const express = require('express');
const multer = require('multer');


let Producto = require(__dirname + '/../models/producto.js');
let autenticacion = require(__dirname + '/../utils/auth.js');
let router = express.Router();
let rol = (rol) => {
    return (req, res, next) => {
        if (rol === req.session.rol)
            next();
        else
            res.render('auth_login');
    }
}


let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "_" + file.originalname)
    }
});

let upload = multer({ storage: storage });

router.get('/', autenticacion,/*rol('admin'),*/ (req, res) => {
    Producto.find().then(resultado => {
        res.render('admin_productos', { productos: resultado });
        
    }).catch(error => {
        res.render('admin_error');
    });
});

/*router.get('/', autenticacion, rol('user'), (req, res) => {
    Producto.find().then(resultado => {
        res.render('admin_productos', { productos: resultado });
    }).catch(error => {
        res.render('admin_error');
    });
});*/

router.get('/nuevo', autenticacion, rol('admin'),(req, res) => {
    res.render('admin_productos_form');
});

router.get('/editar/:id', autenticacion, rol('admin'),(req, res) => {
    Producto.findById(req.params.id).then(resultado => {
        if (resultado)
            res.render('admin_productos_form', { producto: resultado });
        else {
            res.render('admin_error', { error: 'Producto no encontrado' });
        }
    }).catch(error => {
        res.render('admin_error');
    });
});

router.post('/', autenticacion, rol('admin'),upload.single('imagen'), (req, res) => {
    let productoNuevo = new Producto({
        nombre: req.body.nombre,
        precio: req.body.precio,
        descripcion: req.body.descripcion,
        
    });

    if (typeof req.file === 'undefined')
        productoNuevo.imagen = "user.jpg";
    else
        productoNuevo.imagen = req.file.filename;
    productoNuevo.save().then(resultado => {
        res.redirect(req.baseUrl);
    }).catch(error => {
        res.render('admin_error');
    });
});

router.post('/:id', autenticacion,rol('admin'), upload.single('imagen'), (req, res) => {
    if (typeof req.file !== 'undefined') {
        Producto.findByIdAndUpdate(req.params.id, {
            $set: {
                nombre: req.body.nombre,
                precio: req.body.precio,
                descripcion: req.body.descripcion,
                imagen: req.file.filename
            }
        }, { new: true }).then(resultado => {
            res.redirect(req.baseUrl);
        }).catch(error => {
            res.render('admin_error');
        });
    }
    else {
        Producto.findByIdAndUpdate(req.params.id, {
            $set: {
                nombre: req.body.nombre,
                precio: req.body.precio,
                descripcion: req.body.descripcion,
            }
        }, { new: true }).then(resultado => {
            res.redirect(req.baseUrl);
        }).catch(error => {
            res.render('admin_error');
        });
    }
});

router.delete('/:id', autenticacion, rol('admin'),(req, res) => {
    Producto.findByIdAndRemove(req.params.id).then(resultado => {
        res.redirect(req.baseUrl);
    }).catch(error => {
        res.render('admin_error');
    });
});




router.get('/comentarios/:idProducto', autenticacion,rol('user'), (req, res) => {
    Producto.findById(req.params.idProducto).then(resultado => {
        res.render('admin_listado_comentarios', { producto: resultado });
    }).catch(error => {
        res.render('admin_error');
    });
});

router.post('/comentarios/:idProducto', (req, res) => {
    Producto.findById(req.params.idProducto).then(product => {
        product.comentarios.push({ nombreUsuario: req.body.nombreUsuario, comentario: req.body.comentario });
        product.save().then(resultado => {
            res.render("admin_listado_comentarios", { producto: resultado });
        });
    }).catch(error => {
        res.render('publico_error');
    });
});

router.delete('/comentarios/:idProducto/:idComentario', (req, res) => {
    Producto.findById(req.params.idProducto).then(product => {
        if (product.comentarios.length > 0) {
            let comentariosOriginal = product.comentarios.length;

            product.comentarios = product.comentarios.filter(comentario => comentario._id != req.params.idComentario);

            if (product.comentarios.length < comentariosOriginal) {
                product.save().then(resultado => {
                    res.render('admin_listado_comentarios', { producto: resultado });
                });
            }
            else {
                res.render('admin_error');
            }
        }
        else {
            res.render('admin_error');
        }

    }).catch(error => {
        res.render('admin_error');
    });
});

module.exports = router;


