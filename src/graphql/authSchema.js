const { gql } = require('apollo-server-express');

const authTypeDefs = gql`
  type User {
    id: ID!
    email: String!
    firstName: String
    lastName: String
    biography: String
    profileImagePath: String
    roles: [String!]!
  }

  input RegisterInput {
    email: String!
    password: String!
    firstName: String
    lastName: String
    roles: [String!]
  }

  input LoginInput {
    email: String!
    password: String!
  }

  input ForgotPasswordInput {
    email: String!
  }

  input ResetPasswordInput {
    token: String!
    newPassword: String!
  }

  type LoginResponse {
    jwtToken: String!
  }

  type MessageResponse {
    message: String!
  }

  type Query {
    getUsers: [User!]!
    getUserData: User
    validateResetToken(token: String!): Boolean!
  }

  type Mutation {
    register(input: RegisterInput!): MessageResponse!
    registerWithVerification(input: RegisterInput!): MessageResponse!
    confirmEmail(userId: ID!, token: String!): MessageResponse!
    login(input: LoginInput!): LoginResponse!
    forgotPassword(input: ForgotPasswordInput!): MessageResponse!
    resetPassword(input: ResetPasswordInput!): MessageResponse!
    deleteUser(id: ID!): MessageResponse!
  }
`;

module.exports = authTypeDefs;
