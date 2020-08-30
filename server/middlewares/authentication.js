const jwt = require('jsonwebtoken');
//autenticacion del token
let verifyToken = (req, res, next) => {
    let token = req.get('authentication');
    jwt.verify(token, process.env.seed, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no válido'
                }
            });
        }
        req.user = decoded.user;
        next();
    });
}

//autenticacion del rol administrador

let verifyAdmin_Role = (req, res, next) => {
    let user = req.user;
    if (user.role != 'ADMIN_ROLE') {
        return res.json({
            ok: false,
            err: {
                message: 'El usuario no es administrador'
            }
        });
    }
    next();
}

module.exports = {
    verifyToken,
    verifyAdmin_Role
}