const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Service = sequelize.define('Service', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  price: {
    type: DataTypes.DECIMAL,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING(500),
  },
  createdOn: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  categoryId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
}, {
  tableName: 'Services',
});

Service.associate = (models) => {
  Service.belongsTo(models.ServiceCategory, {
    foreignKey: 'categoryId',
    as: 'category',
    onDelete: 'CASCADE',
  });

  Service.hasMany(models.Appointment, {
    foreignKey: 'serviceId',
    as: 'appointments',
    onDelete: 'CASCADE',
  });
};

module.exports = Service;
