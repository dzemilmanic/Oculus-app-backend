const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    userName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    phoneNumber: {
      type: DataTypes.STRING,
    },
    firstName: {
      type: DataTypes.STRING,
    },
    lastName: {
      type: DataTypes.STRING,
    },
    biography: {
      type: DataTypes.TEXT,
    },
    profileImagePath: {
      type: DataTypes.STRING,
    },
  },
  {
    tableName: "Users",
  }
);

User.associate = (models) => {
  User.hasMany(models.Review, {
    foreignKey: "authorId",
    as: "reviews",
    onDelete: "CASCADE",
  });
  User.hasMany(models.Appointment, {
    as: "patientAppointments",
    foreignKey: "patientId",
  });
  User.hasMany(Appointment, {
    as: "doctorAppointments",
    foreignKey: "doctorId",
  });
};

module.exports = User;
