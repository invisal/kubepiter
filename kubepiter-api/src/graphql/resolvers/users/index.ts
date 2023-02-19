import MeResolver from './MeResolver';
import CreateUserResolver from './CreateUserResolver';
import DeleteUserResolver from './DeleteUserResolver';
import UpdateUserResolver from './UpdateUserResolver';
import UserResolver from './UserResolver';
import UsersResolver from './UsersResolver';
import ChangePasswordResolver from './ChangePasswordResolver';

export const UserResolvers = {
  Query: { me: MeResolver, user: UserResolver, users: UsersResolver },
  Mutation: {
    createUser: CreateUserResolver,
    deleteUser: DeleteUserResolver,
    updateUser: UpdateUserResolver,
    changePassword: ChangePasswordResolver,
  },
};
