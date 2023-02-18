import { gql } from 'apollo-server-core';
import createApolloTestServer from '../../../test_utility/createApolloTestServer';
import mockDatabaseInterface from '../../../test_utility/mockDatabaseInterface';

const QUERY_USER = gql`
  query user($id: ID!) {
    user(id: $id) {
      id
      username
      role
    }
  }
`;

describe('UserResolver', () => {
  it('User cannot be query without login', async () => {
    const { query } = createApolloTestServer({});
    const { errors } = await query(QUERY_USER, { id: '' });
    expect(errors).toBeDefined();
  });

  it('Query user', async () => {
    const USER = {
      id: 'some_random_id',
      username: 'some_random_username',
      role: 'OWNER',
      password: '',
    };

    const { query } = createApolloTestServer({
      user: USER,
      db: mockDatabaseInterface({
        getUserById: jest.fn().mockResolvedValue(USER),
      }),
    });
    const { data } = await query(QUERY_USER, { id: USER.id });

    expect(data.user.id).toBe(USER.id);
    expect(data.user.username).toBe(USER.username);
  });
});
