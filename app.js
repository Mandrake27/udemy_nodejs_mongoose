const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error');
const sequelize = require('./util/database');

const Product = require('./models/product');
const User = require('./models/user');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');
const Order = require('./models/order');
const OrderItem = require('./models/order-item');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  User.findByPk(1)
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => console.log(err));
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
User.hasMany(Product);

User.hasOne(Cart);
Cart.belongsTo(User);

Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });

User.hasMany(Order);
Order.belongsTo(User);

Order.belongsToMany(Product, { through: OrderItem });
Product.belongsToMany(Order, { through: OrderItem });

// sequelize.sync({ force: true })
sequelize.sync()
  .then(() => {
    return User.findByPk(1);
  })
  .then((user) => {
    if (!user) {
      return User.create({ name: 'Miras', email: 'test@test.com' })
    }
    return Promise.resolve(user);
  })
  .then((user) => {
    user.getCart()
      .then(cart => {
        if (!cart) {
          return user.createCart({});
        }
        return Promise.resolve(cart);
      })
      .then(() => {
        // lists all helper methods after creating an associations:
        // const model = User;
        // for (let assoc of Object.keys(model.associations)) {
        //   for (let accessor of Object.keys(model.associations[assoc].accessors)) {
        //     console.log(model.name + '.' + model.associations[assoc].accessors[accessor]+'()');
        //   }
        // }
        app.listen(3000);
      });
  })
  .catch((err) => console.log(err));

// User -> Product methods:
// user.getProducts()
// user.setProducts()
// user.addProducts()
// user.addProduct()
// user.createProduct()
// user.removeProduct()
// user.removeProducts()
// user.hasProduct()
// user.hasProducts()
// user.countProducts()

// User -> Cart methods:
// user.getCart()
// user.setCart()
// user.createCart()

// User -> Order methods:
// user.getOrders()
// user.setOrders()
// user.addOrders()
// user.addOrder()
// user.createOrder()
// user.removeOrder()
// user.removeOrders()
// user.hasOrder()
// user.hasOrders()
// user.countOrders()

// Product -> User methods:
// product.getUser()
// product.setUser()
// product.createUser()

// Product -> Cart methods:
// product.getCarts()
// product.setCarts()
// product.addCarts()
// product.addCart()
// product.createCart()
// product.removeCart()
// product.removeCarts()
// product.hasCart()
// product.hasCarts()
// product.countCarts()


// Cart -> User methods:
// cart.getUser()
// cart.setUser()
// cart.createUser()

// Cart -> Product methods:
// cart.getProducts()
// cart.setProducts()
// cart.addProducts()
// cart.addProduct()
// cart.createProduct()
// cart.removeProduct()
// cart.removeProducts()
// cart.hasProduct()
// cart.hasProducts()
// cart.countProducts()

// Order -> User methods:
// order.getUser()
// order.setUser()
// order.createUser()

// Order -> Product methods:
// order.getProducts()
// order.setProducts()
// order.addProducts()
// order.addProduct()
// order.createProduct()
// order.removeProduct()
// order.removeProducts()
// order.hasProduct()
// order.hasProducts()
// order.countProducts()
