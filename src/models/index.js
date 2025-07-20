const User = require('./User');
const Review = require('./Review');
const News = require('./News');
const RoleRequest = require('./RoleRequest');
const Appointment = require('./Appointment');
const Service = require('./Service');
const ServiceCategory = require('./ServiceCategory');

const db = {
  User,
  Review,
  News,
  RoleRequest,
  Appointment,
  Service,
  ServiceCategory,
};

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

module.exports = db;
