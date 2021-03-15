const Deferrable = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  const Exam = sequelize.define("exam", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    studentId: {
      type: DataTypes.INTEGER,
      references: {
        model: "users",
        key: "id",
        deferrable: Deferrable.INITIALLY_DEFERRED,
      },
      allowNull: false,
    },
    teacherId: {
      type: DataTypes.INTEGER,
      references: {
        model: "users",
        key: "id",
        deferrable: Deferrable.INITIALLY_DEFERRED,
      },
      allowNull: false,
    },
    courseId: {
      type: DataTypes.INTEGER,
      references: {
        model: "courses",
        key: "id",
        deferrable: Deferrable.INITIALLY_DEFERRED,
      },
      allowNull: false,
    },
    date: {
      type: DataTypes.DATEONLY,
      isDate: true,
      allowNull: false,
    },
    grade: {
      type: DataTypes.DECIMAL(10, 1),
      allowNull: false,
    },
    isWritten: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  });
  return Exam;
};
