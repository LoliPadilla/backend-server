var express = require('express');

var app = express();

var Hospital = require('../models/hospital');
var Medico = require('../models/medico');
var Usuario = require('../models/usuario');




// ===================================
// Busqueda especifica
//===================================
app.get('/coleccion/:tabla/:busqueda', (req, res, next) => {

    var busqueda = req.params.busqueda;
    var regex = new RegExp(busqueda, 'i');
    var tabla = req.params.tabla;
    var promesa;

    if (tabla === 'medicos') {
        promesa = buscarMedicos(regex);
    }
    else if (tabla === 'hospitales') {
        promesa = buscarHospitales(regex);
    }
    else if (tabla === 'usuarios') {
        promesa = buscarUsuarios(regex);
    }
    else {
        return res.status(400).json({
            ok: false,
            mensaje: 'Tabla no valida',
            error: { menssage: 'Tabla no valida' }
        })
    }

    promesa.then(data => {
        res.status(200).json({
            ok: true,
            [tabla]: data
        })
    })

});

// ===================================
// Busqueda general
//===================================
app.get('/todo/:busqueda', (req, res, next) => {


    var busqueda = req.params.busqueda;
    var regex = new RegExp(busqueda, 'i');


    Promise.all([
        buscarHospitales(regex),
        buscarMedicos(regex),
        buscarUsuarios(regex)
    ]).then(respuestas => {
        res.status(200).json({
            ok: true,
            hospitales: respuestas[0],
            medicos: respuestas[1],
            usuarios: respuestas[2]
        })
    })
});

function buscarHospitales(regex) {

    return new Promise((resolve, reject) => {


        Hospital.find({ nombre: regex })
            .populate('usuario', 'nombre email')
            .exec((err, hospitales) => {

                if (err) {
                    reject('Error al buscar Hospital', err);
                }
                else {
                    resolve(hospitales)
                }

            });

    })
};


function buscarMedicos(regex) {

    return new Promise((resolve, reject) => {

        Medico.find({ nombre: regex })
            .populate('usuario', 'nombre email')
            .populate('hospital')
            .exec((err, medicos) => {

                if (err) {
                    reject('Error al buscar Medico', err);
                }
                else {
                    resolve(medicos)
                }

            });

    })
}


function buscarUsuarios(regex) {

    return new Promise((resolve, reject) => {

        Usuario.find({}, 'nombre email role')
            .or([{ nombre: regex }, { email: regex }])
            .exec((err, usuarios) => {

                if (err) {
                    reject('Error al buscar Medico', err);
                }
                else {
                    resolve(usuarios)
                }

            });

    })
}

module.exports = app;