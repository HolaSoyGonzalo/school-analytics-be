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
      },
      lastname: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      birthday: {
        type: DataTypes.DATEONLY,
        isDate: true,
        allowNull: true,
      },
      gender: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      email: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: true,
        get() {
          return () => this.getDataValue("password");
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

  User.associate = (models) => {
    User.hasMany(models.Post);
  };

  return User;
};
