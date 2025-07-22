import { reviewResolvers } from './reviewResolvers.js';
import { newsResolvers } from './newsResolvers.js';
import { userDataResolvers } from './userDataResolvers.js';

export const resolvers = {
  Query: {
    ...reviewResolvers.Query,
    ...newsResolvers.Query
  },
  Mutation: {
    ...reviewResolvers.Mutation,
    ...newsResolvers.Mutation,
    ...userDataResolvers.Mutation
  },
  ApplicationUser: {
    FullName: (parent) => `${parent.FirstName} ${parent.LastName}`
  }
};