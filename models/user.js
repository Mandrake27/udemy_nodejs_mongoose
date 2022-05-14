const { Schema, model } = require('mongoose');

const toFixedNumber = require('../util/toFixed');

const userSchema = new Schema({
    userName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    cart: {
        items: [{
            product: {
                type: Schema.Types.ObjectId,
                required: true,
                ref: 'Product',
            },
            quantity: {
                type: Number,
                required: true,
            }
        }]
    },
});

userSchema.methods = {
    getUserCart: async function () {
      const { cart } = await this.populate({
          path: 'cart',
          populate: {
              path: 'items',
              populate: {
                  path: 'product',
                  model: 'Product'
              }
          }
      });
        cart.totalPrice = cart.items.reduce((acc, curr) => (acc += curr.product.price * curr.quantity), 0);
        cart.totalPrice = toFixedNumber(cart.totalPrice, 2);
        return cart;
    },

    addToCart: async function (productId) {
        const updatedCart = { ...this.cart };
        const cartProductIndex = updatedCart.items.findIndex(item => item.product._id.toString() === productId.toString());
        if (cartProductIndex !== -1) {
            const cartItem = updatedCart.items[cartProductIndex];
            cartItem.quantity++;
        } else {
            updatedCart.items.push({ product: productId, quantity: 1 });
        }
        this.cart = updatedCart;
        return this.save();
    },

    updateCartItem: async function(operation, productId) {
        const updatedCart = { ...this.cart };
        const cartProductIndex = updatedCart.items.findIndex(item => item.product._id.toString() === productId.toString());
        const cartItem = updatedCart.items[cartProductIndex];
        updatedCart.items[cartProductIndex].quantity =
            operation === 'increase' ? cartItem.quantity + 1 : cartItem.quantity - 1;
        if (cartItem.quantity === 0) {
            updatedCart.items = updatedCart.items.filter(item =>
                item.product._id.toString() !== cartItem.product._id.toString()
            )
        }
        this.cart = updatedCart;
        return this.save();
    },

    deleteCartItem: async function(productId) {
        const updatedCart = { ...this.cart };
        updatedCart.items = updatedCart.items.filter(item => item.product._id.toString() !== productId.toString());
        this.cart = updatedCart;
        return this.save();
    },

    clearCart: async function() {
        this.cart.items = [];
        return this.save();
    }
};

module.exports = model('User', userSchema);
