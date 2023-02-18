import { gql } from 'apollo-server-core';
import MeResolver from './MeResolver';
import CreateUserResolver from './CreateUserResolver';
import DeleteUserResolver from './DeleteUserResolver';
import UpdateUserResolver from './UpdateUserResolver';
import UserResolver from './UserResolver';
import UsersResolver from './UsersResolver';
import ChangePasswordResolver from './ChangePasswordResolver';

export const UserSchemas = gql`
  extend type Query {
    me: User
    user(id: ID!): User
    users: [User]
  }

  extend type Mutation {
    createUser(value: UserInput!): CreateUserResponse
    updateUser(id: ID!, value: UserInput!): Boolean
    deleteUser(id: ID!): Boolean
    changePassword(oldPassword: String!, newPassword: String!): Boolean
  }

  type User {
    id: ID
    username: String
    role: String
  }

  input UserInput {
    username: String
  }

  type CreateUserResponse {
    id: ID
    password: String
  }
`;

export const UserResolvers = {
  Query: { me: MeResolver, user: UserResolver, users: UsersResolver },
  Mutation: {
    createUser: CreateUserResolver,
    deleteUser: DeleteUserResolver,
    updateUser: UpdateUserResolver,
    changePassword: ChangePasswordResolver,
  },
};
