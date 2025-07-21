export const typeDefs = `#graphql
  type ApplicationUser {
    Id: ID!
    FirstName: String!
    LastName: String!
    Biography: String
    ProfileImagePath: String
    FullName: String!
  }

  type Review {
    Id: ID!
    Rating: Int!
    Content: String!
    CreatedOn: String!
    UpdatedOn: String!
    AuthorId: String!
    Author: ApplicationUser!
  }

  type ReviewDto {
    Id: ID!
    Rating: Int!
    Content: String!
    CreatedOn: String!
    UpdatedOn: String!
    AuthorName: String!
  }

  type News {
    Id: Int!
    Title: String!
    Content: String!
    PublishedDate: String!
  }

  type UserReviewCheck {
    hasReview: Boolean!
  }

  type DeleteResponse {
    Success: Boolean!
    Message: String!
  }

  input ReviewInput {
    Rating: Int!
    Content: String!
  }

  input ReviewUpdateInput {
    Rating: Int!
    Content: String!
  }

  input NewsInput {
    Title: String!
    Content: String!
    PublishedDate: String!
  }

  input NewsUpdateInput {
    Title: String!
    Content: String!
    PublishedDate: String!
  }

  type Query {
    # Review queries
    reviews: [ReviewDto!]!
    review(id: ID!): ReviewDto
    userReviewCheck: UserReviewCheck!
    
    # News queries
    allNews: [News!]!
    newsById(id: Int!): News
  }

  type Mutation {
    # Review mutations
    createReview(input: ReviewInput!): ReviewDto!
    updateReview(id: ID!, input: ReviewUpdateInput!): Review!
    deleteReview(id: ID!): DeleteResponse!
    
    # News mutations (Admin only)
    createNews(input: NewsInput!): News!
    updateNews(id: Int!, input: NewsUpdateInput!): News!
    deleteNews(id: Int!): DeleteResponse!
  }
`;
