import { reviewResolvers } from './reviewResolvers.js';
import { newsResolvers } from './newsResolvers.js';

export const resolvers = {
  Query: {
    ...reviewResolvers.Query,
    ...newsResolvers.Query
  },
  Mutation: {
    ...reviewResolvers.Mutation,
    ...newsResolvers.Mutation
  },
  ApplicationUser: {
    FullName: (parent) => `${parent.FirstName} ${parent.LastName}`
  }
};