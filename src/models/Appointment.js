const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Appointment = sequelize.define('Appointment', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  serviceId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  patientId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  doctorId: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  appointmentDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  notes: {
    type: DataTypes.TEXT,
  },
  createdOn: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  status: {
    type: DataTypes.ENUM('Pending', 'Approved', 'Completed', 'Canceled'),
    allowNull: false,
    defaultValue: 'Pending',
  },
}, {
  tableName: 'Appointments',
});

Appointment.associate = (models) => {
  Appointment.belongsTo(models.User, {
    foreignKey: 'patientId',
    as: 'patient',
    onDelete: 'CASCADE',
  });

  Appointment.belongsTo(models.User, {
    foreignKey: 'doctorId',
    as: 'doctor',
    onDelete: 'SET NULL',
  });

  Appointment.belongsTo(models.Service, {
    foreignKey: 'serviceId',
    as: 'service',
    onDelete: 'CASCADE',
  });
};

module.exports = Appointment;
