import { gql } from 'apollo-server-core';
import createApolloTestServer from '../../../test_utility/createApolloTestServer';
import mockDatabaseInterface from '../../../test_utility/mockDatabaseInterface';

const MUTATION_UPDATE_USER = gql`
  mutation updateUser($id: ID!, $value: UserInput!) {
    updateUser(id: $id, value: $value)
  }
`;

describe('UpdateUserResolver', () => {
  it('Access deny for non-login user', async () => {
    const { mutate } = createApolloTestServer({});
    const { errors } = await mutate(MUTATION_UPDATE_USER, { id: 'some_id' });
    expect(errors).toBeDefined();
  });

  it('Non-owner user cannot update user', async () => {
    const { mutate } = createApolloTestServer({
      user: { id: 'some_id', username: 'normal_user', password: '' },
    });

    const { errors } = await mutate(MUTATION_UPDATE_USER, { id: 'some_id', value: { username: 'hello' } });
    expect(errors).toBeDefined();
  });

  it('Update user using OWNER account', async () => {
    const USER_WITH_OWNER_PERMISSION = {
      id: 'some_random_id',
      username: 'some_random_username',
      role: 'OWNER',
      password: '',
    };

    const UPDATE_USER_ID = 'user';
    const UPDATE_USER_VALUE = { username: 'hello' };

    const mockUserUpdate = jest.fn().mockResolvedValue(true);

    const { mutate } = createApolloTestServer({
      user: USER_WITH_OWNER_PERMISSION,
      db: mockDatabaseInterface({
        updateUser: mockUserUpdate,
      }),
    });

    await mutate(MUTATION_UPDATE_USER, { id: UPDATE_USER_ID, value: UPDATE_USER_VALUE });
    expect(mockUserUpdate).toBeCalled();
    expect(mockUserUpdate.mock.calls[0][0]).toBe(UPDATE_USER_ID);
    expect(mockUserUpdate.mock.calls[0][1].username).toBe(UPDATE_USER_VALUE.username);
  });
});
