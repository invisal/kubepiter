import http from 'http';
import { Server } from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';
import getDatabaseConnection from '../drivers/databases/DatabaseInstance';

export default function setupSubscription(httpServer: http.Server, schema: any) {
  const wsServer = new Server({
    server: httpServer,
    path: '/graphql',
  });

  return useServer(
    {
      schema,
      context: async (ctx) => {
        const token = ctx.connectionParams?.authToken as string;
        const db = getDatabaseConnection();

        if (token) {
          const user = await db.getUserToken(token as string);
          return { user };
        }
      },
    },
    wsServer,
  );
}
