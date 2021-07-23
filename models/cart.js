const fs = require('fs');
const path = require('path');

const p = path.join(
  path.dirname(require.main.filename),
  'data',
  'cart.json',
);

const Product = require('./product');

const getCartFromFile = cb => {
  fs.readFile(p, (err, fileContent) => {
    if (err) {
      cb([]);
    } else {
      cb(JSON.parse(fileContent));
    }
  });
};

module.exports = class Cart {
  static addProduct(id, productPrice) {
    fs.readFile(p, (err, fileContent) => {
        let cart = { products: [], totalPrice: 0 };
        if (!err) {
          cart = JSON.parse(fileContent.toString());
        }
        const existingProductIndex = cart.products.findIndex((product) => product.id === id);
        if (existingProductIndex !== -1) {
          cart.products[existingProductIndex].quantity += 1;
        } else {
          const newProduct = { id, quantity: 1 };
          cart.products = [...cart.products, newProduct];
        }
        cart.totalPrice = cart.totalPrice + +productPrice;
        fs.writeFile(p, JSON.stringify(cart), (err) => console.log(err));
      }
    );
  }

  static getCart(cb) {
    getCartFromFile(cart => {
      if (cart.products.length) {
        Product.fetchAll(products => {
            const cartProducts = [];
            for (let { id, quantity } of cart.products) {
              const neededProduct = products.find(product => product.id === id);
              if (neededProduct) cartProducts.push({ ...neededProduct, quantity });
            }
            cb({ products: cartProducts, totalPrice: cart.totalPrice });
          }
        );
      } else {
        cb({ products: [], totalPrice: 0 });
      }
    });
  }

  static removeFromCart(productId) {
    getCartFromFile(cart => {
      let updatedCartProducts;
      Product.fetchAll(products => {
        const productFromGlobalList = products.find(({ id }) => id === productId);
        const productToDeleteIndex = cart.products.findIndex(({ id }) => id === productId);
        if (cart.products[productToDeleteIndex].quantity > 1) {
          cart.products[productToDeleteIndex].quantity -= 1;
          updatedCartProducts = cart.products;
        } else {
          updatedCartProducts = cart.products.filter(({ id }) => id !== productId);
        }
        cart.totalPrice -= productFromGlobalList.price;
        fs.writeFile(p, JSON.stringify({ products: updatedCartProducts, totalPrice: cart.totalPrice }), err => {
          if (err) {
            console.log(err);
          } else {
            Product.deleteProduct(productId);
          }
        });
      });
    });
  }
};