const bcrypt = require("bcrypt");
const Deferrable = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  const Teacher = sequelize.define(
    "teacher",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      firstname: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastname: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      birthday: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      gender: {
        type: DataTypes.ENUM("M", "F", "O"),
        allowNull: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      salt: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      hooks: {
        beforeCreate: async function (teacher) {
          const salt = await bcrypt.genSalt(12);
          teacher.salt = salt;
          teacher.password = await bcrypt.hash(teacher.password, salt);
        },
        beforeUpdate: async function (teacher) {
          console.log(teacher);
          if (teacher.attributes.password) {
            const salt = await bcrypt.genSalt(12);
            teacher.attributes.password = await bcrypt.hash(
              teacher.attributes.password,
              salt
            );
          }
        },
      },
    }
  );
  return Teacher;
};
