var express = require('express');

var mdAutentificacion = require('../middelware/autentificaion')

var app = express();
var Medico = require('../models/medico');


// ====================================
// Get medicos
// =====================================
app.get('/', (req, res, next) => {


    var desde = req.query.desde || 0;
    desde = Number(desde);

    Medico.find({})
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .populate('hospital')
        .exec((err, medicos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error cargando medico',
                    errors: err
                })
            }

            Medico.count({}, (err, conteo) => {
                res.status(200).json({
                    ok: true,
                    medicos: medicos,
                    total: conteo
                })
            });

        })


})



// ====================================
// Actualizar medicos
// =====================================
app.put('/:id', mdAutentificacion.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Medico.findById(id)
        .exec((err, medico) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar medico',
                    errors: err
                })
            }

            if (!medico) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'El medico con el id' + id + 'no existe',
                    errors: { mensaje: 'El medico con el id' + id + 'no existe' }
                })
            }

            medico.nombre = body.nombre;
            medico.usuario = req.usuario._id;
            medico.hospital = body.hospital;

            medico.save((err, medicoGuardado) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        mensaje: 'Error al actualizar medico',
                        errors: err
                    })
                }
                medicoGuardado.password = ';)';
                res.status(200).json({
                    ok: true,
                    medico: medicoGuardado
                })
            })


        })


})

// ====================================
// Crear medicoes
// =====================================
app.post('/', mdAutentificacion.verificaToken, (req, res, next) => {

    var body = req.body;

    var medico = new Medico({
        nombre: body.nombre,
        usuario: req.usuario._id,
        hospital: body.hospital,
        img: body.img
    })

    medico.save((err, medicoGuardado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error guardando medico',
                errors: err
            })
        }
        res.status(200).json({
            ok: true,
            medico: medicoGuardado
        })
    })



})


// ====================================
// Borrar medicos
// =====================================
app.delete('/:id', (req, res) => {

    var id = req.params.id;

    Medico.findByIdAndRemove(id)
        .exec((err, medicoBorrado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al borrar medico',
                    errors: err
                })
            }

            if (!medicoBorrado) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'No exisite un medico con ese id',
                    errors: { message: 'No exise un medico con ese id' }
                })
            }
            res.status(200).json({
                ok: true,
                medico: medicoBorrado
            })
        })
})

module.exports = app;