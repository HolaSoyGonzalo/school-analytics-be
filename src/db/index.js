const { DataTypes, Sequelize } = require("sequelize");
const bcrypt = require("bcrypt");

const Student = require("./student");
const Teacher = require("./teacher");
const Admin = require("./admin");
const Exam = require("./exam");
const Class = require("./class");
const Course = require("./course");

const sequelize = new Sequelize(
  process.env.PGDATABASE,
  process.env.PGUSER,
  process.env.PGPASSWORD,
  {
    host: process.env.PGHOST,
    dialect: "postgres",
  }
);

const models = {
  Student: Student(sequelize, DataTypes),
  Teacher: Teacher(sequelize, DataTypes),
  Admin: Admin(sequelize, DataTypes),
  Exam: Exam(sequelize, DataTypes),
  Class: Class(sequelize, DataTypes),
  Course: Course(sequelize, DataTypes)
};

Object.keys(models).forEach((modelName) => {
  if ("associate" in models[modelName]) {
    models[modelName].associate(models);
  }
});

models.Student.prototype.validPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

models.sequelize = sequelize;

module.exports = models;
