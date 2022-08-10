import { gql } from 'apollo-server-core';
import createApolloTestServer from '../../../test_utility/createApolloTestServer';
import mockDatabaseInterface from '../../../test_utility/mockDatabaseInterface';

const MUTATION_CREATE_USER = gql`
  mutation createUser($value: UserInput!) {
    createUser(value: $value) {
      id
      password
    }
  }
`;

describe('CreateUserResolver', () => {
  it('Access deny for non-login user', async () => {
    const { mutate } = createApolloTestServer({});
    const { errors } = await mutate(MUTATION_CREATE_USER, { username: 'test' });
    expect(errors).toBeDefined();
  });

  it('Non-owner user cannot create new user', async () => {
    const { mutate } = createApolloTestServer({
      user: { id: 'some_id', username: 'normal_user', password: '' },
    });
    const { errors } = await mutate(MUTATION_CREATE_USER, { username: 'test' });
    expect(errors).toBeDefined();
  });

  it('Create user using OWNER account', async () => {
    const USER_WITH_OWNER_PERMISSION = {
      id: 'some_random_id',
      username: 'some_random_username',
      role: 'OWNER',
      password: '',
    };

    const USER_TOBE_INSERTED = { username: 'test' };
    const USER_NEW_INSERTED_ID = 'new_insert_id';

    const mockUserInsert = jest.fn().mockResolvedValue(USER_NEW_INSERTED_ID);

    const { mutate } = createApolloTestServer({
      user: USER_WITH_OWNER_PERMISSION,
      db: mockDatabaseInterface({
        insertUser: mockUserInsert,
      }),
    });

    const { data } = await mutate(MUTATION_CREATE_USER, { value: USER_TOBE_INSERTED });
    expect(data.createUser.id).toBe(USER_NEW_INSERTED_ID);
    expect(mockUserInsert).toBeCalled();
  });
});
