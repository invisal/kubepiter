import UpdateAppResolver from '../UpdateAppResolver';
import AppResolver from './AppResolver';
import AppsResolver from './AppsResolver';
import CreateAppResolver from './CreateAppResolver';
import DeleteAppResolver from './DeleteAppResolver';
import RegenerateAppWebhookResolver from './RegenerateAppWebhookResolver';
import RollbackAppResolver from './RollbackAppResolver';

export const AppResolvers = {
  Query: {
    apps: AppsResolver,
    app: AppResolver,
  },
  Mutation: {
    updateApp: UpdateAppResolver,
    createApp: CreateAppResolver,
    deleteApp: DeleteAppResolver,
    regenerateAppWebhook: RegenerateAppWebhookResolver,
    rollbackApp: RollbackAppResolver,
  },
};
