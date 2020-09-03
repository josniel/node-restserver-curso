const express = require('express');

const { verifyToken } = require('../middlewares/authentication');

let app = express();

let Product = require('../models/product');

// =========================================
//  Create products
// =========================================
app.post('/products', verifyToken, (req, res) => {
    let body = req.body;
    let product = new Product({
        name: body.name,
        price: body.price,
        description: body.description,
        category: body.category,
        user: req.user._id,
        avaiable: body.avaiable
    });

    product.save((err, productDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        res.status(201).json({
            ok: true,
            product: productDB
        });
    });
});

app.put('/products/:id', verifyToken, (req, res) => {
    let id = req.params.id;
    let body = req.body;
    Product.findById(id, (err, productDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (err) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El Id no es correcto'
                }
            });
        }
        productDB.name = body.name;
        productDB.price = body.price;
        productDB.description = body.description;
        productDB.category = body.category;
        productDB.user = body.user;
        productDB.avaiable = body.avaiable;

        productDB.save((err, productSaved) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            res.status(201).json({
                ok: true,
                product: productSaved
            });
        });
    });
});

app.delete('/products/:id', verifyToken, (req, res) => {
    let id = req.params.id;
    let changeStatus = {
        avaiable: false
    };

    Product.findByIdAndUpdate(id, changeStatus, (err, productDisabled) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        if (!productDisabled) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Producto no encontrado'
                }
            });
        }
        res.json({
            ok: true,
            message: 'Este producto fue deshabilitado'
        });
    });
});

app.get('/products', verifyToken, (req, res) => {
    let since = req.query.since || 0;
    since = Number(since);
    let limit = req.query.limit || 5;
    limit = Number(limit);

    Product.find({ avaiable: true })
        .skip(since)
        .limit(limit)
        .sort('name')
        .populate('User', 'name email')
        .populate('Category', 'name')
        .exec((err, products) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            Product.count({ avaiable: true }, (err, counting) => {
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
                    products,
                    counting
                })
            })

        });
})

app.get('/products/:id', verifyToken, (req, res) => {
    let id = req.params.id;
    Product.findById(id, (err, productDB) => {
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
            productDB
        })
    });
});

app.get('/products/search/:item', verifyToken, (req, res) => {
    let item = req.params.item;
    let regex = new RegExp(item, 'i');
    Product.find({ nombre: regex })
        .populate('category', 'name')
        .exec((err, products) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                products
            })
        });
});

module.exports = app;