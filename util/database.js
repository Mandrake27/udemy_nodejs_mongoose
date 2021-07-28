const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("node-complete", "root", "mandrake37", {
  dialect: "mysql",
  host: "localhost",
});

module.exports = sequelize;
