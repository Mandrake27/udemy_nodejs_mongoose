const Product = require("./product");

module.exports = class Cart {
  static addProduct(id, productPrice) {
    fs.readFile(p, (err, fileContent) => {
      let cart = { products: [], totalPrice: 0 };
      if (!err) {
        cart = JSON.parse(fileContent.toString());
      }
      const existingProductIndex = cart.products.findIndex(
        (product) => product.id === id
      );
      if (existingProductIndex !== -1) {
        cart.products[existingProductIndex].quantity += 1;
      } else {
        const newProduct = { id, quantity: 1 };
        cart.products = [...cart.products, newProduct];
      }
      cart.totalPrice = cart.totalPrice + +productPrice;
      fs.writeFile(p, JSON.stringify(cart), (err) => console.log(err));
    });
  }

  static getCart(cb) {
    getCartFromFile(cb);
  }

  static getFullInfoCart(fullProductsInfoArray, cb) {
    getCartFromFile((cart) => {
      if (cart.products.length) {
        const cartProducts = [];
        for (let { id, quantity } of cart.products) {
          const neededProduct = fullProductsInfoArray.find(
            (product) => product.id === id
          );
          if (neededProduct) cartProducts.push({ ...neededProduct, quantity });
        }
        cb({ products: cartProducts, totalPrice: cart.totalPrice });
      } else {
        cb({ products: [], totalPrice: 0 });
      }
    });
  }

  static removeFromCart(product, totalDelete = false) {
    getCartFromFile((cart) => {
      let updatedCartProducts;
      const productToDeleteIndex = cart.products.findIndex(
        ({ id }) => id === product.id
      );
      if (totalDelete) {
        if (productToDeleteIndex !== -1) {
          const { quantity } = cart.products.find(
            ({ id }) => id === product.id
          );
          updatedCartProducts = cart.products.filter(
            ({ id }) => id !== product.id
          );
          cart.totalPrice -= product.productPrice * quantity;
          fs.writeFile(
            p,
            JSON.stringify({
              products: updatedCartProducts,
              totalPrice: cart.totalPrice,
            }),
            (err) => {
              if (err) {
                console.log(err);
              }
            }
          );
        }
      } else {
        if (cart.products[productToDeleteIndex].quantity > 1) {
          cart.products[productToDeleteIndex].quantity -= 1;
          updatedCartProducts = cart.products;
        } else {
          updatedCartProducts = cart.products.filter(
            ({ id }) => id !== product.id
          );
        }
        cart.totalPrice -= product.productPrice;
        fs.writeFile(
          p,
          JSON.stringify({
            products: updatedCartProducts,
            totalPrice: cart.totalPrice,
          }),
          (err) => {
            if (err) {
              console.log(err);
            }
          }
        );
      }
    });
  }
};
