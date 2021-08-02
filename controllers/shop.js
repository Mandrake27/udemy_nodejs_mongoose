const Product = require('../models/product');
const CartItem = require('../models/cart-item');

exports.getProducts = (req, res) => {
  Product.findAll()
    .then((products) => {
      res.render('shop/product-list', {
        prods: products,
        pageTitle: 'All Products',
        path: '/products',
      });
    })
    .catch((err) => console.log(err));
};

exports.getProduct = (req, res) => {
  const { id } = req.params;
  Product.findByPk(id)
    .then((product) => {
      res.render('shop/product-detail', {
        product,
        pageTitle: product.title,
        path: '',
      });
    })
    .catch((err) => console.log(err));
};

exports.getIndex = (req, res) => {
  Product.findAll()
    .then((products) => {
      res.render('shop/index', {
        prods: products,
        pageTitle: 'Shop',
        path: '/',
      });
    })
    .catch((err) => console.log(err));
};

exports.getCart = async (req, res) => {
  req.user
    .getCart()
    .then((cart) => {
      return cart
        .getProducts()
        .then((products) => {
          const cart = {
            products,
            totalPrice: (products.reduce(
              (acc, curr) => (acc += curr.price * curr.cartItem.quantity),
              0,
            )).toFixed(2),
          };
          res.render('shop/cart', {
            path: '/cart',
            pageTitle: 'Your Cart',
            cart,
          });
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
};

exports.postAddToCart = (req, res) => {
  const { id } = req.body;
  req.user
    .getCart()
    .then((cart) => {
      CartItem.findOne({ where: { productId: id, cartId: cart.id } })
        .then((cartItem) => {
          if (cartItem) {
            return CartItem.update(
              { quantity: cartItem.quantity + 1 },
              { where: { id: cartItem.id, productId: id } },
            );
          }
          return CartItem.create({
            quantity: 1,
            cartId: cart.id,
            productId: id,
          });
        })
        .then(() => res.redirect('/cart'))
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
};

exports.postDeleteFromCart = (req, res) => {
  CartItem.findByPk(req.body.id)
    .then(cartItem => {
      if (cartItem.quantity > 1) {
        return CartItem.update({ quantity: cartItem.quantity -= 1 }, { where: { id: cartItem.id } })
      }
      return CartItem.destroy({ where: { id: cartItem.id } });
    })
    .then(() => res.redirect('/cart'))
    .catch(err => console.log(err));
};

exports.getOrders = (req, res) => {
  res.render('shop/orders', {
    path: '/',
    pageTitle: 'Your Orders',
  });
};

exports.postAddOrder = (req, res) => {
  req.user
    .getCart()
    .then((cart) => {
      CartItem.findOne({ where: { productId: id, cartId: cart.id } })
        .then((cartItem) => {
          if (cartItem) {
            return CartItem.update(
              { quantity: cartItem.quantity + 1 },
              { where: { id: cartItem.id, productId: id } },
            );
          }
          return CartItem.create({
            quantity: 1,
            cartId: cart.id,
            productId: id,
          });
        })
        .then(() => res.redirect('/cart'))
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
  // ===========================================
  req.user.getCart()
    .then(cart => cart.getProducts())
    .then(products => {
      let totalPrice = 0;
      for (let product of products) {
        totalPrice += product.price * product.cartItem.quantity;
      }
    })
    .catch(err => console.log(err));
};

exports.getCheckout = (req, res) => {
  res.render('shop/checkout', {
    path: '/checkout',
    pageTitle: 'Checkout',
  });
};
