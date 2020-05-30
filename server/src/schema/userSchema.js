var { buildSchema } = require('graphql')

var schema = buildSchema(`
  type Query {
    user(id: ID!): User
    users: [User]
    me: User
  }

  type User {
    id: ID!
    name: String!
    email: String!
    password: String!
  }

  input UserInput {
    name: String!
    email: String!
    password: String!
  }

  input LoginInput {
    email: String!
    password: String!
  }

  input ResetPasswordInput {
    email: String!
    token: String!
    password: String!
  }

  type Mutation {
    addUser(input: UserInput): User!
    updateUser(id: ID!, input: UserInput!): User!
    deleteUser(id: ID!): Boolean!
    sign(input: LoginInput!): User!
    forgotMyPassword(email: String!): Boolean!
    resetMyPassword(input: ResetPasswordInput!): Boolean!
  }
`)

module.exports = schema