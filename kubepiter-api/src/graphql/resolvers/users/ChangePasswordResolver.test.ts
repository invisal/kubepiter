import { gql } from 'apollo-server-core';
import bcrypt from 'bcrypt';
import createApolloTestServer from '../../../test_utility/createApolloTestServer';
import mockDatabaseInterface from '../../../test_utility/mockDatabaseInterface';

const MUTATION_CHANGE_PASSWORD = gql`
  mutation changePassword($oldPassword: String!, $newPassword: String!) {
    changePassword(oldPassword: $oldPassword, newPassword: $newPassword)
  }
`;

describe('Change password', () => {
  test('Provide invalid password, should not change password and throw error', async () => {
    const USER_ID = '23c23c243csdsdq2324';
    const OLD_PASSWORD = '12345678';

    const mockDb = mockDatabaseInterface({
      updateUser: jest.fn(),
    });

    const { mutate } = createApolloTestServer({
      user: { id: USER_ID, password: bcrypt.hashSync(OLD_PASSWORD, 10), username: 'kube' },
      db: mockDb,
    });

    const { errors } = await mutate(MUTATION_CHANGE_PASSWORD, {
      oldPassword: 'old_incorrect_password',
      newPassword: 'new_password',
    });

    expect(errors).toBeDefined();
    expect(mockDb.updateUser).toBeCalledTimes(0);
  });

  test('Provide correct correct old password', async () => {
    const USER_ID = '23c23c243csdsdq2324';
    const OLD_PASSWORD = '12345678';
    const NEW_PASSWORD = 'new_password';
    const mockDb = mockDatabaseInterface({
      updateUser: jest.fn(),
    });

    const { mutate } = createApolloTestServer({
      user: { id: USER_ID, password: bcrypt.hashSync(OLD_PASSWORD, 10), username: 'kube' },
      db: mockDb,
    });

    const { errors } = await mutate(MUTATION_CHANGE_PASSWORD, {
      oldPassword: OLD_PASSWORD,
      newPassword: NEW_PASSWORD,
    });

    expect(errors).toBeUndefined();
    expect(mockDb.updateUser).toBeCalledTimes(1);
    expect(bcrypt.compareSync(NEW_PASSWORD, (mockDb.updateUser as jest.Mock).mock.calls[0][1].password)).toBeTruthy();
  });
});
