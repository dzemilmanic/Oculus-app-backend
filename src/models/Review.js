const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Review = sequelize.define('Review', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  createdOn: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updatedOn: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  authorId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  tableName: 'Reviews',
});

Review.associate = (models) => {
  Review.belongsTo(models.User, {
    foreignKey: 'authorId',
    as: 'author',
    onDelete: 'CASCADE',
  });
};

module.exports = Review;
