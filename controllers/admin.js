const Product = require('../models/product');

exports.getAddProduct = (req, res) => {
    res.render('admin/edit-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        editing: false,
    });
};

exports.postAddProduct = async (req, res) => {
    try {
        const newProduct = { ...req.body, userId: req.user._id };
        const product = new Product(newProduct);
        await product.save();
        res.redirect('/admin/products');
    } catch (err) {
        console.log(err);
    }
};

exports.getEditProduct = async (req, res) => {
    const { edit } = req.query;
    const { id } = req.params;
    try {
        const product = await Product.findById(id);
        res.render('admin/edit-product', {
            pageTitle: 'Edit Product',
            path: '/admin/edit-product',
            editing: Boolean(edit),
            product,
        });
    } catch (err) {
        console.log(err);
    }
};

exports.postEditProduct = async (req, res) => {
    try {
        await Product.updateOne({ _id: req.body._id }, { ...req.body });
        res.redirect('/admin/products');
    } catch (err) {
        console.log(err);
    }
};

exports.postDeleteProduct = async (req, res) => {
    const { id } = req.body;
    try {
        await Product.deleteOne({ _id: id });
        res.redirect('/admin/products');
    } catch (err) {
        console.log(err)
    }
};

exports.getProducts = async (req, res) => {
    try {
        const products = await Product.find({ userId: req.user._id })
        res.render('admin/products', {
            prods: products,
            pageTitle: 'Admin Products',
            path: '/admin/products',
        });
    } catch (err) {
        console.log(err);
    }
};
