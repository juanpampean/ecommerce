const Sequelize = require("sequelize");
const path = require('path');
const fs = require('fs');
const db = require('../database/models')
const sequelize = db.sequelize;
const Op = Sequelize.Op;
const { validationResult } = require('express-validator');








//*---------------------------------------------------------------------------------------------*//

const controller = {
    list: (req, res) => {
        db.product.findAll({
                include: [{ association: "productoProveedor" }],
                include: [{ association: "categoriaProducto" }]
            })
            .then(function(product) {
                res.render('listadoDeProductos', { product })
            })
    },

    detail: (req, res) => {
        let adminlist = [3,13,23] /* Share here the ID of the admin users*/
        db.product.findByPk(req.params.id, {
                include: [{ association: "productoProveedor" }],
                include: [{ association: "categoriaProducto" }]
            })
            .then(function(product) {
                res.render('detail', { product,adminlist });
            })
        
    },

    add: (req, res) => {
        let product = db.product.findByPk(req.params.id);
        let categoriaProducto = db.productCategory.findAll();
        let productoProveedor = db.supplier.findAll();

        Promise.all([product, categoriaProducto, productoProveedor])
            .then(function([product, categoriaProducto, productoProveedor]) {
                return res.render('form_productos_create', { product: product, categoriaProducto: categoriaProducto, productoProveedor: productoProveedor });
            });
    },

    create: (req, res) => {
        const errors = validationResult(req)
        if (errors.errors.length > 0) {
            let product = db.product.findByPk(req.params.id);
            let categoriaProducto = db.productCategory.findAll();
            let productoProveedor = db.supplier.findAll();
            Promise.all([product, categoriaProducto, productoProveedor])
            .then(function([product, categoriaProducto, productoProveedor]) {
                return res.render('form_productos_create', {product: product, categoriaProducto: categoriaProducto, productoProveedor: productoProveedor,errors: errors.mapped()})
            })         
            .catch(error => res.send(error))
            }else
        {db.product.create({
            SKU: req.body.SKU,
            nombre: req.body.nombre,
            precio: req.body.precio,
            peso: req.body.peso,
            descripcion: req.body.descripcion,
            create_date: req.body.create_date,
            categoria_id: req.body.categoria_id,
            imagen:req.file.filename,
            stock: req.body.stock,
            proveedor_id: req.body.proveedor_id,
        }).then(function(){
            return res.redirect('/product/listadoDeProductos')})}
    },

    edit: (req, res) => {
        let product = db.product.findByPk(req.params.id);
        let categoriaProducto = db.productCategory.findAll();
        let productoProveedor = db.supplier.findAll();

        Promise.all([product, categoriaProducto, productoProveedor])
            .then(function([product, categoriaProducto, productoProveedor]) {
                return res.render('form_productos_edit', { product: product, categoriaProducto: categoriaProducto, productoProveedor: productoProveedor });
            });
    },

    update: (req, res) => {
        const errors = validationResult(req)
        if (errors.errors.length > 0) {
            let product = db.product.findByPk(req.params.id);
            let categoriaProducto = db.productCategory.findAll();
            let productoProveedor = db.supplier.findAll();
    
            Promise.all([product, categoriaProducto, productoProveedor])
                .then(function([product, categoriaProducto, productoProveedor]) {
                    return res.render('form_productos_edit', { product: product, categoriaProducto: categoriaProducto, productoProveedor: productoProveedor,errors: errors.mapped() });
                })
                .catch(error => res.send(error));
        } else
    {db.product.update({
            SKU: req.body.SKU,
            nombre: req.body.nombre,
            precio: req.body.precio,
            peso: req.body.peso,
            descripcion: req.body.descripcion,
            create_date: req.body.create_date,
            categoria_id: req.body.categoria_id,
            stock: req.body.stock,
            proveedor_id: req.body.proveedor_id,
            imagen: req.file.filename,
        }, {
            where: {
                id: req.params.id
            }
        })
        res.redirect("/product/listadoDeProductos")
    }},

    destroy: (req, res) => {
        db.product.destroy({
            where: {
                id: req.params.id
            }
        })
        res.redirect("/product/listadoDeProductos")
    },
    search: (req, res, next) => {
        db.product.findAll({
                where: {
                    nombre: {
                        [Op.like]: '%' + req.query.search + '%'
                    }
                }
            })
            .then(function(product) {
                res.render('listadoDeProductos', { product })
            })
    },

    buscar: (req, res) => {
        res.render('form_search');
    },

    carrito: (req, res) => {
        res.render('productCart');
    },

    productDetail: (req, res) => {
        res.render('productDetail')
    },
    productDetail_2: (req, res) => {
        res.render('productDetail_2')
    },
    productDetail_3: (req, res) => {
        res.render('productDetail_3')
    },


}

//TODO: exportar el modulo
module.exports = controller;