const { Appointment, User, Service } = require('../models');
const { Op } = require('sequelize');

const appointmentResolvers = {
  Query: {
    appointments: async () => {
      return await Appointment.findAll({
        include: [
          { model: User, as: 'patient' },
          { model: User, as: 'doctor' },
          { model: Service, as: 'service' },
        ],
      });
    },

    appointment: async (_, { id }) => {
      return await Appointment.findByPk(id, {
        include: [
          { model: User, as: 'patient' },
          { model: User, as: 'doctor' },
          { model: Service, as: 'service' },
        ],
      });
    },

    appointmentsByUser: async (_, { userId }) => {
      return await Appointment.findAll({
        where: { patientId: userId },
        include: [
          { model: User, as: 'patient' },
          { model: User, as: 'doctor' },
          { model: Service, as: 'service' },
        ],
      });
    },

    appointmentsByDoctor: async (_, { doctorId }) => {
      return await Appointment.findAll({
        where: { doctorId },
        include: [
          { model: User, as: 'patient' },
          { model: User, as: 'doctor' },
          { model: Service, as: 'service' },
        ],
      });
    },

    checkAvailability: async (_, { appointmentDate }) => {
      const doctorsCount = await User.count({ where: { role: 'doctor' } });

      const existingAppointments = await Appointment.count({
        where: {
          appointmentDate,
          status: { [Op.ne]: 'Canceled' },
        },
      });

      if (existingAppointments >= doctorsCount) {
        throw new Error('All appointments are booked for this time slot.');
      }

      return 'Available';
    },
  },

  Mutation: {
    createAppointment: async (_, { input }) => {
      const doctorsCount = await User.count({ where: { role: 'doctor' } });

      const existingAppointments = await Appointment.count({
        where: {
          appointmentDate: input.appointmentDate,
          status: { [Op.ne]: 'Canceled' },
        },
      });

      if (existingAppointments >= doctorsCount) {
        throw new Error('Time slot is fully booked.');
      }

      const appointment = await Appointment.create({
        serviceId: input.serviceId,
        patientId: input.patientId,
        appointmentDate: input.appointmentDate,
        notes: input.notes,
        status: input.status || 'Pending',
        createdOn: new Date(),
      });

      return appointment;
    },

    updateAppointment: async (_, { id, input }) => {
      const appointment = await Appointment.findByPk(id);
      if (!appointment) throw new Error('Appointment not found.');

      appointment.serviceId = input.serviceId;
      appointment.patientId = input.patientId;
      appointment.appointmentDate = input.appointmentDate;
      appointment.notes = input.notes;
      if(input.status) appointment.status = input.status;

      await appointment.save();
      return appointment;
    },

    assignDoctor: async (_, { id, doctorId }) => {
      const appointment = await Appointment.findByPk(id);
      if (!appointment) throw new Error('Appointment not found.');

      const doctor = await User.findOne({ where: { id: doctorId, role: 'doctor' } });
      if (!doctor) throw new Error('Doctor not found.');

      appointment.doctorId = doctorId;
      appointment.status = 'Approved';

      await appointment.save();
      return appointment;
    },

    updateNotes: async (_, { id, notes }) => {
      const appointment = await Appointment.findByPk(id);
      if (!appointment) throw new Error('Appointment not found.');

      appointment.notes = notes;
      appointment.status = 'Completed';

      await appointment.save();
      return appointment;
    },

    cancelAppointment: async (_, { id }) => {
      const appointment = await Appointment.findByPk(id);
      if (!appointment) throw new Error('Appointment not found.');

      if (appointment.status === 'Canceled') {
        throw new Error('Appointment is already canceled.');
      }

      appointment.status = 'Canceled';
      await appointment.save();
      return appointment;
    },

    deleteAppointment: async (_, { id }) => {
      const appointment = await Appointment.findByPk(id);
      if (!appointment) throw new Error('Appointment not found.');

      await appointment.destroy();
      return true;
    },
  },

  Appointment: {
    patient: async (appointment) => {
      return await User.findByPk(appointment.patientId);
    },
    doctor: async (appointment) => {
      if (!appointment.doctorId) return null;
      return await User.findByPk(appointment.doctorId);
    },
    service: async (appointment) => {
      return await Service.findByPk(appointment.serviceId);
    },
  },
};

module.exports = appointmentResolvers;
