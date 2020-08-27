const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');
const User = require('../models/user');
const user = require('../models/user');
const app = express();

app.get('/user', function(req, res) {

    let since = req.query.since || 0;
    since = Number(since);
    let limit = req.query.limit || 5;
    limit = Number(limit);
    user.find({ status: true }, 'name email role google status img')
        .skip(since)
        .limit(limit)
        .exec((err, users) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }
            User.count({ status: true }, (err, counting) => {
                res.json({
                    ok: true,
                    users,
                    counting
                });
            });
        });
});

app.post('/user', function(req, res) {
    let body = req.body;
    let user = new User({
        name: body.name,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    user.save((err, userDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        // userDB.password = null;
        res.json({
            ok: true,
            user: userDB
        })
    });
});

app.put('/user/:id', function(req, res) {
    let id = req.params.id;
    let body = _.pick(req.body, ['name', 'email', 'img', 'role', 'status']);
    User.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, userDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            user: userDB
        });
    });

});

app.delete('/user/:id', function(req, res) {
    let id = req.params.id;
    let changeStatus = {
        status: false
    };
    User.findByIdAndUpdate(id, changeStatus, (err, userDisabled) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        };
        if (!userDisabled) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            });
        };
        res.json({
            ok: true,
            user: userDisabled
        });
    });
});

module.exports = app;