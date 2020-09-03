const express = require('express');

const _ = require('underscore');

const { verifyToken, verifyAdmin_Role } = require('../middlewares/authentication');

const app = express();

const category = require('../models/category');


app.get('/category', verifyToken, (req, res) => {
    category.find({})
        .sort('name')
        .populate('User', 'name email')
        .exec((err, categories) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            category.count({ status: true }, (err, counting) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        err: {
                            message: 'No se pudo contabilizar correctamente'
                        }
                    })
                }
                res.json({
                    ok: true,
                    categories,
                    counting
                })
            })

        });
});

app.get('/category/:id', verifyToken, (req, res) => {
    let id = req.params.id;
    category.findById(id, (err, categoryDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'No existe este ID'
                }
            });
        }
        res.json({
            ok: true,
            categoryDB
        })
    });
});

app.post('/category', [verifyToken, verifyAdmin_Role], (req, res) => {
    let body = req.body;
    let category = new category({
        name: body.name
    });
    category.save((err, categoryDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            category: categoryDB
        })
    });
});

app.put('/category/:id', [verifyToken, verifyAdmin_Role], (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['name', 'status']);
    category.findByIdAndUpdate(id, body, (err, categoryDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            category: categoryDB
        });
    });
});

app.delete('/category/:id', [verifyToken, verifyAdmin_Role], (req, res) => {
    let id = req.params.id;
    category.findByIdAndRemove(id, (err, userDeleted) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        };
        if (!userDeleted) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            });
        };
        res.json({
            ok: true,
            userDeleted
        });
    });
});

module.exports = app;