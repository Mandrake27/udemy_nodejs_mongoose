const fs = require('fs');
const path = require('path');
const rootDir = require('../util/path');
const p = path.join(rootDir, 'data', 'products.json');

const getProductsFromFile = (cb) => {
    fs.readFile(p, (err, data) => {
        if (err) {
            return cb([]);
        }
        cb(JSON.parse(data.toString()));
    });
};

module.exports = class Product {
    constructor(title, price, image_link, description) {
        this.title = title;
        this.price = price;
        this.image_link = image_link;
        this.description = description;
    }

    save() {
        getProductsFromFile(products => {
            products.push(this);
            fs.writeFile(p, JSON.stringify(products), err => console.log('ERROR', err));
        });
    }

    static fetchAll(cb) {
        getProductsFromFile(cb);
    }
};