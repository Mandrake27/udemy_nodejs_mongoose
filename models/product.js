const fs = require('fs');
const path = require('path');

const p = path.join(
  path.dirname(process.mainModule.filename),
  'data',
  'products.json',
);

const getProductsFromFile = cb => {
  fs.readFile(p, (err, fileContent) => {
    if (err) {
      cb([]);
    } else {
      cb(JSON.parse(fileContent));
    }
  });
};

module.exports = class Product {
  constructor(title, imageUrl, description, price) {
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  save() {
    this.id = Math.random().toString();
    getProductsFromFile(products => {
      products.push(this);
      fs.writeFile(p, JSON.stringify(products), err => {
        console.log(err);
      });
    });
  }

  static fetchAll(cb) {
    getProductsFromFile(cb);
  }

  static findByProductId(productId, cb) {
    getProductsFromFile(products => {
      const neededProduct = products.find(({ id }) => id === productId);
      cb(neededProduct);
    });
  }

  static updateProductInfo(product) {
    getProductsFromFile(products => {
      const neededProductIndex = products.findIndex(({ id }) => id === product.id);
      products[neededProductIndex] = product;
      fs.writeFile(p, JSON.stringify(products), err => {
        console.log(err);
      });
    });
  }

  static deleteProduct(productId) {
    getProductsFromFile(products => {
      const updatedProducts = products.filter(({ id }) => id !== productId);
      fs.writeFile(p, JSON.stringify(updatedProducts), err => {
        console.log(err);
      });
    });
  }
};
