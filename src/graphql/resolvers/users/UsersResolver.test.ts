import { gql } from 'apollo-server-core';
import createApolloTestServer from '../../../test_utility/createApolloTestServer';
import mockDatabaseInterface from '../../../test_utility/mockDatabaseInterface';

const QUERY_USERS = gql`
  query users {
    users {
      id
      username
      role
    }
  }
`;

describe('UsersResolver', () => {
  it('Access deny for non-login user', async () => {
    const { query } = createApolloTestServer({});
    const { errors } = await query(QUERY_USERS);
    expect(errors).toBeDefined();
  });

  it('Get all users', async () => {
    const CURRENT_USER = {
      id: 'some_random_id',
      username: 'some_random_username',
      role: 'OWNER',
      password: '',
    };

    const USER_LIST = [
      { id: 'xxx1', username: 'Jame' },
      { id: 'xxx2', username: 'Henry' },
    ];

    const mockGetUserList = jest.fn().mockReturnValue(USER_LIST);

    const { query } = createApolloTestServer({
      user: CURRENT_USER,
      db: mockDatabaseInterface({
        getUserList: mockGetUserList,
      }),
    });

    const { data } = await query(QUERY_USERS);
    expect((data.users || []).length).toBe(2);
    expect(data.users[0].username).toBe(USER_LIST[0].username);
  });
});
