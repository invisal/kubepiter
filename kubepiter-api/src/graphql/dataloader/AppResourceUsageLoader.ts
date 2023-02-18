import DataLoader from 'dataloader';
import { Environment } from 'src/Environment';
import { GqlResourceUsageDetail } from 'src/generated/graphql';
import GraphContext from 'src/types/GraphContext';

export default function createAppResourceUsageLoader(ctx: GraphContext) {
  return new DataLoader<string, GqlResourceUsageDetail>(async (keys) => {
    const pods = await ctx.metricManager.getPods(Environment.DEFAULT_NAMESPACE);

    return keys.map((appId) => {
      const appPods = pods.filter((pod) => pod.Pod.metadata?.labels?.app === appId);
      return {
        totalPod: appPods.length,
        memory: {
          usage: appPods.reduce((a, b) => a + Number(b.Memory.CurrentUsage.valueOf()), 0),
          limit: appPods.reduce((a, b) => a + Number(b.Memory.LimitTotal.valueOf()), 0),
          request: appPods.reduce((a, b) => a + Number(b.Memory.RequestTotal.valueOf()), 0),
        },
        cpu: {
          usage: appPods.reduce((a, b) => a + Number(b.CPU.CurrentUsage.valueOf()), 0),
          limit: appPods.reduce((a, b) => a + Number(b.CPU.LimitTotal.valueOf()), 0),
          request: appPods.reduce((a, b) => a + Number(b.CPU.RequestTotal.valueOf()), 0),
        },
      };
    });
  });
}
