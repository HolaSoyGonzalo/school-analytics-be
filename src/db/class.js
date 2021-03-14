module.exports = (sequelize, DataTypes) => {
  const Class = sequelize.define("class", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    section: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    year: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  });

  // Class.associate = (models) => {};

  return Class;
};
