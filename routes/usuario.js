var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var SEED = require('../config').SEED;

var app = express();
var Usuario = require('../models/usuario');


// ====================================
// Get Usuarios
// =====================================
app.get('/', (req, res, next) => {

    Usuario.find({}, 'nombre email role')
        .exec((err, usuarios) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error cargando usuario',
                    errors: err
                })
            }
            res.status(200).json({
                ok: true,
                usuarios: usuarios
            })


        })


})



// ====================================
// Actualizar Usuarios
// =====================================
app.put('/:id', (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Usuario.findById(id, 'nombre email role')
        .exec((err, usuario) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar usuario',
                    errors: err
                })
            }

            if (!usuario) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'El usuario con el id' + id + 'no existe',
                    errors: { mensaje: 'El usuario con el id' + id + 'no existe' }
                })
            }

            usuario.nombre = body.nombre;
            usuario.email = body.email;
            usuario.role = body.role;

            usuario.save((err, usuarioGuardado) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        mensaje: 'Error al actualizar usuario',
                        errors: err
                    })
                }
                usuarioGuardado.password = ';)';
                res.status(200).json({
                    ok: true,
                    usuario: usuarioGuardado
                })
            })


        })


})

// ====================================
// Crear Usuarios
// =====================================
app.post('/', (req, res, next) => {

    var body = req.body;

    var usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        img: body.img,
        role: body.role
    })

    usuario.save((err, usuarioGuardado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error guardando usuario',
                errors: err
            })
        }
        res.status(200).json({
            ok: true,
            usuario: usuarioGuardado
        })
    })



})


// ====================================
// Borrar Usuarios
// =====================================
app.delete('/:id', (req, res) => {

    var id = req.params.id;

    Usuario.findByIdAndRemove(id)
        .exec((err, usuarioBorrado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al borrar usuario',
                    errors: err
                })
            }

            if (!usuarioBorrado) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'No exisite un usuario con ese id',
                    errors: { message: 'No exise un usario con ese id' }
                })
            }
            res.status(200).json({
                ok: true,
                usuario: usuarioBorrado
            })
        })
})

module.exports = app;