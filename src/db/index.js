const { DataTypes, Sequelize } = require("sequelize");
const bcrypt = require("bcrypt");

const User = require("./user");
const Exam = require("./exam");
const Class = require("./class");
const Course = require("./course");

const connect_ssl = process.env.db_ssl_connect === "true" ? { ssl: { require: true, rejectUnauthorized: false } } : {};

const sequelize = new Sequelize(
  process.env.db_name,
  process.env.db_user,
  process.env.db_password,
  {
    host: process.env.db_host,
    port: process.env.db_port,
    dialect: process.env.db_dialect,
    dialectOptions: connect_ssl,
  }
);

const models = {
  User: User(sequelize, DataTypes),
  Exam: Exam(sequelize, DataTypes),
  Class: Class(sequelize, DataTypes),
  Course: Course(sequelize, DataTypes),
};

Object.keys(models).forEach((modelName) => {
  if ("associate" in models[modelName]) {
    models[modelName].associate(models);
  }
});

models.User.prototype.validPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

models.sequelize = sequelize;

module.exports = models;
