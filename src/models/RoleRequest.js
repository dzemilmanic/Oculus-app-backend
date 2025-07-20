const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const RoleRequest = sequelize.define('RoleRequest', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  firstName: {
    type: DataTypes.STRING,
  },
  lastName: {
    type: DataTypes.STRING,
  },
  biography: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  imagePath: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'Pending',
    allowNull: false,
  },
}, {
  tableName: 'RoleRequests',
});

module.exports = RoleRequest;
