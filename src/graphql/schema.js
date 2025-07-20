const { gql } = require('apollo-server-express');

const typeDefs = gql`
  scalar DateTime
  scalar UUID

  enum AppointmentStatus {
    Pending
    Approved
    Completed
    Canceled
  }

  type User {
    id: UUID!
    firstName: String
    lastName: String
  }

  type Service {
    id: UUID!
    name: String
    price: Float
    description: String
    createdOn: DateTime
  }

  type Appointment {
    id: UUID!
    serviceId: UUID!
    patientId: UUID!
    doctorId: UUID
    appointmentDate: DateTime!
    notes: String
    status: AppointmentStatus!
    createdOn: DateTime!

    patient: User
    doctor: User
    service: Service
  }

  input AppointmentInput {
    serviceId: UUID!
    patientId: UUID!
    doctorId: UUID
    appointmentDate: DateTime!
    notes: String
    status: AppointmentStatus
  }

  type Query {
    appointments: [Appointment!]!
    appointment(id: UUID!): Appointment
    appointmentsByUser(userId: UUID!): [Appointment!]!
    appointmentsByDoctor(doctorId: UUID!): [Appointment!]!
    checkAvailability(appointmentDate: DateTime!): String!
  }

  type Mutation {
    createAppointment(input: AppointmentInput!): Appointment!
    updateAppointment(id: UUID!, input: AppointmentInput!): Appointment!
    assignDoctor(id: UUID!, doctorId: UUID!): Appointment!
    updateNotes(id: UUID!, notes: String!): Appointment!
    cancelAppointment(id: UUID!): Appointment!
    deleteAppointment(id: UUID!): Boolean!
  }
`;

module.exports = typeDefs;
