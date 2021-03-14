module.exports = (sequelize, DataTypes) => {
  const Exam = sequelize.define("exam", {
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
    date: {
      type: DataTypes.DATE,
      isDate: true,
      allowNull: true,
    },
    grade: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    isWritten: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  });

  // Exam.associate = (models) => {};

  return Exam;
};
