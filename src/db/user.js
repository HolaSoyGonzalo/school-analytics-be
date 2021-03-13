const bcrypt = require("bcrypt");

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "user",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      fullname: {
        type: DataTypes.STRING,
        allowNull: true,
        get() {
          return () => this.getDataValue("fullname");
        },
      },
      lastname: {
        type: DataTypes.STRING,
        allowNull: true,
        get() {
          return () => this.getDataValue("lastname");
        },
      },
      birthday: {
        type: DataTypes.DATEONLY,
        isDate: true,
        allowNull: true,
        get() {
          return () => this.getDataValue("birthday");
        },
      },
      gender: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      email: {
        type: DataTypes.STRING,
        allowNull: true,
        get() {
          return () => this.getDataValue("email");
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: true,
        get() {
          return () => this.getDataValue("psw");
        },
      },

      //   imgurl: {
      //     type: DataTypes.STRING(420),
      //     allowNull: true,
      //   },

      role: { type: DataTypes.STRING, defaultValue: "user" },
    },
    {
      hooks: {
        beforeCreate: async function (user) {
          const salt = await bcrypt.genSalt(12);
          user.password = await bcrypt.hash(user.password, salt);
        },
        beforeBulkUpdate: async function (user) {
          console.log(user);
          if (user.attributes.password) {
            const salt = await bcrypt.genSalt(12);
            user.attributes.password = await bcrypt.hash(
              user.attributes.password,
              salt
            );
          }
        },
      },
    }
  );

  User.associate = (models) => {};
  return User;
};
