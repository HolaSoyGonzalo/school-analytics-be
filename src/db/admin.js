const bcrypt = require("bcrypt");
const Deferrable = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  const Admin = sequelize.define(
    "admin",
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
        allowNull: false,
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
        beforeCreate: async function (admin) {
          const salt = await bcrypt.genSalt(12);
          admin.salt = salt;
          admin.password = await bcrypt.hash(admin.password, salt);
        },
        beforeUpdate: async function (admin) {
          console.log(admin);
          if (admin.attributes.password) {
            const salt = await bcrypt.genSalt(12);
            admin.attributes.password = await bcrypt.hash(
              admin.attributes.password,
              salt
            );
          }
        },
      },
    }
  );
  return Admin;
};
