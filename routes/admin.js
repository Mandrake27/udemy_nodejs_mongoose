const path = require('path');

const express = require('express');
const router = express.Router();

const rootDir = require('../util/path');

const products = [];

router.get('/add-product', (req, res, next) => {
    res.render('add-product', { docTitle: 'Add Product', path: '/admin/add-product' });
});

router.post('/add-product', (req, res, next) => {
    const { title, image_link, price, description } = req.body;
    products.push({
        title,
        image_link,
        price,
        description
    });
    res.redirect('/');
});

module.exports = {
    routes: router,
    products
}
