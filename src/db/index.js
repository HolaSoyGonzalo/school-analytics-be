const { DataTypes, Sequelize } = require("sequelize");
const bcrypt = require("bcrypt");

const User = require("./models/user");
const Exam = require("./models/exam");
const Class = require("./models/class");
const Course = require("./models/course");

const sequelize = new Sequelize(
  process.env.db_name,
  process.env.db_user,
  process.env.db_password,
  {
    host: process.env.db_host,
    port: process.env.db_port,
    dialect: "postgres",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
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

models.dbConnection = sequelize;

module.exports = models;
