const db = require('../util/database');

module.exports = class Product {
  constructor(title, price, description, imageUrl) {
    this.title = title;
    this.price = price;
    this.description = description;
    this.imageUrl = imageUrl;
  }

  save() {
    return db.execute('INSERT INTO products (title, price, description, imageUrl) VALUES (?, ?, ?, ?)',
      [this.title, this.price, this.description, this.imageUrl]);
  }

  static fetchAll() {
    return db.execute('SELECT * FROM products');
  }

  static findProductById(productId) {
    return db.execute('SELECT * FROM products WHERE productId = ?', [productId]);
  }

  static updateProductInfo({ productId, title, price, description, imageUrl }) {
    return db.execute('UPDATE products SET title = ?, price = ?, description = ?, imageUrl = ? WHERE productId = ?',
      [title, price, description, imageUrl, productId]);
  }

  static deleteProductById(productId) {
    return db.execute(`DELETE FROM products WHERE productId = ${productId}`);
  }
};
