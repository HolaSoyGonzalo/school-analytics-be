module.exports = (sequelize, DataTypes) => {
  const Course = sequelize.define("course", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  });

  Course.associate = (models) => {};

  return Course;
};
