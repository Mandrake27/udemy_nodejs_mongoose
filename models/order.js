const { Sequelize, DataTypes } = require('sequelize');

const sequelize = require('../util/database');

const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
  },
  totalPrice: {
    type: DataTypes.INTEGER,
    allowNull: false,
  }
});

module.exports = Order;