const bcrypt = require("bcrypt");
const Deferrable = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  const Student = sequelize.define(
    "student",
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
    },
    {
      hooks: {
        beforeCreate: async function (student) {
          const salt = await bcrypt.genSalt(12);
          student.salt = salt;
          student.password = await bcrypt.hash(student.password, salt);
        },
        beforeUpdate: async function (student) {
          console.log(student);
          if (student.attributes.password) {
            const salt = await bcrypt.genSalt(12);
            student.attributes.password = await bcrypt.hash(
              student.attributes.password,
              salt
            );
          }
        },
      },
    }
  );
  return Student;
};
