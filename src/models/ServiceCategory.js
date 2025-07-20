const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const ServiceCategory = sequelize.define('ServiceCategory', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING(500),
  },
  createdOn: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'ServiceCategories',
});

ServiceCategory.associate = (models) => {
  ServiceCategory.hasMany(models.Service, {
    foreignKey: 'categoryId',
    as: 'services',
    onDelete: 'CASCADE',
  });
};

module.exports = ServiceCategory;
