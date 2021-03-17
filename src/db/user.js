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
        allowNull: true,
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
        type: DataTypes.ENUM("M", "F", "O", "AH"),
        allowNull: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      password: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      salt: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      registration_uuid: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      is_registered: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        default: false
      },
      role: {
        type: DataTypes.ENUM("student", "teacher", "admin"),
        allowNull: false,
      },
    },
    {
      hooks: {
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
  return User;
};
