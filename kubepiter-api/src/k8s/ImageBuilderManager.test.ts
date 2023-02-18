import { ImageBuilderManager } from '../k8s/ImageBuilderManager';

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

describe('Build Image Queue', () => {
  test('Build image should run all of in queue', async () => {
    const SUCCESS_LOG_CONTENT = 'Success log';

    const coreApi = {
      readNamespacedPod: jest
        .fn()
        .mockResolvedValue(fakeRunningResponse)
        .mockResolvedValue(fakeRunningResponse)
        .mockResolvedValue(fakeSuccessResponse)
        .mockResolvedValue(fakeRunningResponse)
        .mockResolvedValue(fakeRunningResponse)
        .mockResolvedValue(fakeSuccessResponse),

      createNamespacedPod: jest.fn(),
      deleteNamespacedPod: jest.fn(),
      readNamespacedPodLog: jest.fn().mockResolvedValue({ body: SUCCESS_LOG_CONTENT }),
    };

    const db = {
      getBuilderSetting: jest.fn().mockResolvedValue({}),
      insertBuildLog: jest.fn(),
      updateBuildLog: jest.fn(),
    };

    const mockCallback01 = jest.fn();
    const mockCallback02 = jest.fn();

    const builderQueue = new ImageBuilderManager(coreApi as any, db as any, () => {});

    builderQueue.create(
      {
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
      },
      mockCallback01,
    );

    builderQueue.create(
      {
        git: {
          url: 'https://yahoo.com',
          branch: 'master',
          username: 'name',
          password: 'password',
        },
        imagePullSecret: 'test',
        appId: 'test2',
        image: 'invisal/hello-foo',
        version: '1',
        args: [],
      },
      mockCallback02,
    );

    // Wait for 40 seconds
    let retryAttemptLeft = 10;
    while (--retryAttemptLeft >= 0) {
      await new Promise((r) => setTimeout(r, 4000));
      if (builderQueue.getQueue().length === 0) break;
    }

    expect(mockCallback01).toBeCalled();
    expect(mockCallback02).toBeCalled();
  }, 40000);
});
