import { gql } from 'apollo-server-core';
import createApolloTestServer from '../../../test_utility/createApolloTestServer';
import mockDatabaseInterface from '../../../test_utility/mockDatabaseInterface';

const MUTATE_REGENERATE_WEBHOOk = gql`
  mutation regenerateAppWebhook($id: ID!) {
    regenerateAppWebhook(id: $id)
  }
`;

describe('RegenerateAppWebhookTokenResolver', () => {
  it('User must login to regenerate token', async () => {
    const { mutate } = createApolloTestServer({});
    const { errors } = await mutate(MUTATE_REGENERATE_WEBHOOk, { id: 1 });
    expect(errors).toBeDefined();
  });

  it('Regenerate token should update webhookToken field', async () => {
    const APP_ID = 'app_test';
    const mockUpdateApp = jest.fn().mockResolvedValue(true);

    const { mutate } = createApolloTestServer({
      db: mockDatabaseInterface({
        updatePartialAppById: mockUpdateApp,
      }),
      user: { id: '1', username: 'invisal', password: 'some_random' },
    });

    const { data } = await mutate(MUTATE_REGENERATE_WEBHOOk, { id: APP_ID });
    expect(mockUpdateApp).toBeCalledWith(APP_ID, { webhookToken: data.regenerateAppWebhook });
  });
});
