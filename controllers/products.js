const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
    res.render('add-product', {
        docTitle: 'Add Product',
        path: '/admin/add-product',
    });
};

exports.postAddProduct = (req, res, next) => {
    const { title, image_link, price, description } = req.body;
    const product = new Product(title, price, image_link, description);
    product.save();
    res.redirect('/');
};

exports.getProducts = (req, res, next) => {
    Product.fetchAll((products) => {
        res.render('shop', {
            docTitle: 'Shop',
            prods: products,
            path: '/',
            hasProducts: products.length > 0,
        });
    });
};