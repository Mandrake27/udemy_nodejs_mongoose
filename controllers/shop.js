const Product = require('../models/product');
const Order = require('../models/orders');

exports.getProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.render('shop/product-list', {
            prods: products,
            pageTitle: 'All Products',
            path: '/products',
        });
    } catch (err) {
        console.log(err);
    }
};

exports.getProduct = async (req, res) => {
    const { productId } = req.params;
    try {
        const product = await Product.findById(productId);
        res.render('shop/product-detail', {
            product,
            pageTitle: product.title,
            path: '',
        });
    } catch (err) {
        console.log(err);
        res.redirect('/');
    }
};

exports.getIndex = async (req, res) => {
    try {
        const products = await Product.find();
        res.render('shop/index', {
            prods: products,
            pageTitle: 'Shop',
            path: '/',
        });
    } catch (err) {
        console.log(err)
    }
};

exports.getCart = async (req, res) => {
    try {
        const cart = await req.user.getUserCart();
        res.render('shop/cart', {
            path: '/cart',
            pageTitle: 'Your Cart',
            cart,
        });
    } catch (err) {
        console.log(err);
    }
};

exports.postAddToCart = async (req, res) => {
    try {
        await req.user.addToCart(req.body._id);
        res.redirect('/cart');
    } catch (err) {
        console.log(err);
    }
};

exports.updateCartItem = async (req, res) => {
    try {
        const { operation } = req.query;
        const { productId } = req.params;
        await req.user.updateCartItem(operation, productId);
        res.redirect('/cart');
    } catch (err) {
        console.log(err);
    }
}

exports.postDeleteFromCart = async (req, res) => {
    try {
        await req.user.deleteCartItem(req.body.id);
        res.redirect('/cart');
    } catch (err) {
        console.log(err);
    }
};

exports.getOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id });
        res.render('shop/orders', { orders, pageTitle: 'Your Orders', path: '/orders' });
    } catch (err) {
        console.log(err);
    }
};

exports.postAddOrder = async (req, res) => {
    try {
        const cart = await req.user.getUserCart();
        const cartProducts = cart.items.map(({ product, quantity }) => ({
            product: {
                title: product.title,
                price: product.price,
                description: product.description,
                imageUrl: product.imageUrl,
            },
            quantity,
        }));
        const order = new Order({ user: req.user, products: cartProducts });
        await order.save();
        await req.user.clearCart();
        res.redirect('/orders');
    } catch (err) {
        console.log(err);
    }
};
