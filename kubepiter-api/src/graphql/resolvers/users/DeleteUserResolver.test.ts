import { gql } from 'apollo-server-core';
import createApolloTestServer from '../../../test_utility/createApolloTestServer';
import mockDatabaseInterface from '../../../test_utility/mockDatabaseInterface';

const MUTATION_DELETE_USER = gql`
  mutation deleteUser($id: ID!) {
    deleteUser(id: $id)
  }
`;

describe('DeleteUserResolver', () => {
  it('Access deny for non-login user', async () => {
    const { mutate } = createApolloTestServer({});
    const { errors } = await mutate(MUTATION_DELETE_USER, { id: 'some_id' });
    expect(errors).toBeDefined();
  });

  it('Non-owner user cannot delete user', async () => {
    const { mutate } = createApolloTestServer({
      user: { id: 'some_id', username: 'normal_user', password: '' },
    });

    const { errors } = await mutate(MUTATION_DELETE_USER, { id: 'some_id' });
    expect(errors).toBeDefined();
  });

  it('Owner cannot delete it own account', async () => {
    const USER_WITH_OWNER_PERMISSION = {
      id: 'some_random_id',
      username: 'some_random_username',
      role: 'OWNER',
      password: '',
    };

    const { mutate } = createApolloTestServer({ user: USER_WITH_OWNER_PERMISSION });

    const { errors } = await mutate(MUTATION_DELETE_USER, { id: USER_WITH_OWNER_PERMISSION.id });
    expect(errors).toBeDefined();
  });

  it('Delete user using OWNER account', async () => {
    const USER_WITH_OWNER_PERMISSION = {
      id: 'some_random_id',
      username: 'some_random_username',
      role: 'OWNER',
      password: '',
    };

    const DELETE_USER_ID = 'id_tobe_deleted';

    const mockUserDeleted = jest.fn().mockResolvedValue(true);

    const { mutate } = createApolloTestServer({
      user: USER_WITH_OWNER_PERMISSION,
      db: mockDatabaseInterface({
        deleteUser: mockUserDeleted,
      }),
    });

    await mutate(MUTATION_DELETE_USER, { id: DELETE_USER_ID });
    expect(mockUserDeleted).toBeCalledWith(DELETE_USER_ID);
  });
});
