var express = require('express');

var mdAutentificacion = require('../middelware/autentificaion')

var app = express();
var Hospital = require('../models/hospital');


// ====================================
// Get Hospitales
// =====================================
app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Hospital.find({})
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .exec((err, hospitales) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error cargando hospital',
                    errors: err
                })
            }
            Hospital.count({}, (err, conteo) => {
                res.status(200).json({
                    ok: true,
                    hospitales: hospitales,
                    total: conteo
                })
            });


        })


})



// ====================================
// Actualizar Hospitales
// =====================================
app.put('/:id', (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Hospital.findById(id)
        .exec((err, hospital) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar hospital',
                    errors: err
                })
            }

            if (!hospital) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'El hospital con el id' + id + 'no existe',
                    errors: { mensaje: 'El hospital con el id' + id + 'no existe' }
                })
            }

            hospital.nombre = body.nombre;
            hospital.usuario = body.usuario;

            hospital.save((err, hospitalGuardado) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        mensaje: 'Error al actualizar hospital',
                        errors: err
                    })
                }
                hospitalGuardado.password = ';)';
                res.status(200).json({
                    ok: true,
                    hospital: hospitalGuardado
                })
            })


        })


})

// ====================================
// Crear Hospitales
// =====================================
app.post('/', mdAutentificacion.verificaToken, (req, res, next) => {

    var body = req.body;
    console.log(req.usuario);

    var hospital = new Hospital({
        nombre: body.nombre,
        usuario: req.usuario._id,
        img: body.img
    })

    hospital.save((err, hospitalGuardado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error guardando hospital',
                errors: err
            })
        }
        res.status(200).json({
            ok: true,
            hospital: hospitalGuardado
        })
    })



})


// ====================================
// Borrar HOspitales
// =====================================
app.delete('/:id', (req, res) => {

    var id = req.params.id;

    Hospital.findByIdAndRemove(id)
        .exec((err, hospitalBorrado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al borrar hospital',
                    errors: err
                })
            }

            if (!hospitalBorrado) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'No exisite un hospital con ese id',
                    errors: { message: 'No exise un hospital con ese id' }
                })
            }
            res.status(200).json({
                ok: true,
                hospital: hospitalBorrado
            })
        })
})

module.exports = app;