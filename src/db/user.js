const bcrypt = require("bcrypt");
const Deferrable = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "user",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      classroomId: {
        type: DataTypes.INTEGER,
        references: {
          model: "classes",
          key: "id",
          deferrable: Deferrable.INITIALLY_DEFERRED,
        },
        allowNull: false,
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
      role: {
        type: DataTypes.ENUM("student", "teacher", "admin"),
        allowNull: false,
      },
    },
    {
      hooks: {
        beforeCreate: async function (user) {
          const salt = await bcrypt.genSalt(12);
          user.salt = salt;
          user.password = await bcrypt.hash(user.password, salt);
        },
        beforeUpdate: async function (user) {
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
    // User.hasMany(models.Post);
  };

  return User;
};
