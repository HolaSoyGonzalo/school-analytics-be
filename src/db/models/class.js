module.exports = (sequelize, DataTypes) => {
  const Class = sequelize.define("class", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    section: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: "section_year"
    },
    year: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: "section_year"
    },
  });
  return Class;
};
