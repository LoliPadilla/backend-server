
var jwt = require('jsonwebtoken');
var SEED = require('../config').SEED;


// ====================================
// Verificar Token
// =====================================

exports.verificaToken = function (req, res, next) {


    var token = req.query.token;

    jwt.verify(token, SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                mensaje: 'Token incorrecto',
                errors: err
            })
        }
        console.log(decoded);
        req.usuario = decoded.usario;
        next();

    });




}
