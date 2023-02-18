import buildImageAndPush from './ImageBuilder';
import { ImageBuildJobStatus } from './ImageBuilderManager';

const fakeRunningResponse = {
  body: {
    status: {
      phase: 'Running',
    },
  },
};

const fakeSuccessResponse = {
  body: {
    status: {
      phase: 'Succeeded',
    },
  },
};

describe('Build Image', () => {
  test('Build image and await till success', async () => {
    const SUCCESS_LOG_CONTENT = 'Success log';

    const coreApi = {
      readNamespacedPod: jest
        .fn()
        .mockResolvedValue(fakeRunningResponse)
        .mockResolvedValue(fakeRunningResponse)
        .mockResolvedValue(fakeSuccessResponse),
      createNamespacedPod: jest.fn(),
      deleteNamespacedPod: jest.fn(),
      readNamespacedPodLog: jest.fn().mockResolvedValue({ body: SUCCESS_LOG_CONTENT }),
    };

    const db = {
      getBuilderSetting: jest.fn().mockResolvedValue({}),
    };

    const r = await buildImageAndPush(coreApi as any, db as any, {
      git: {
        url: 'https://google.com',
        branch: 'master',
        username: 'name',
        password: 'password',
      },
      imagePullSecret: 'test',
      appId: 'test',
      image: 'invisal/hello-world',
      version: '1',
      args: [],
    });

    expect(r.status).toBe(ImageBuildJobStatus.SUCCESS);
    expect(r.logs).toBe(SUCCESS_LOG_CONTENT);
  });
});
