const { gql } = require('apollo-server-express');

const newsTypeDefs = gql`
  type News {
    id: Int!
    title: String!
    content: String!
    publishedDate: String!
  }

  input NewsInput {
    title: String!
    content: String!
    publishedDate: String!
  }

  type Query {
    allNews: [News!]!
    newsById(id: Int!): News
  }

  type Mutation {
    addNews(input: NewsInput!): News!
    updateNews(id: Int!, input: NewsInput!): News!
    deleteNews(id: Int!): Boolean!
  }
`;

module.exports = newsTypeDefs;
