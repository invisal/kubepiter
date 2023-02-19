import PodLogResolver from './PodLogResolver';
import PodResolver from './PodResolver';
import PodsResolver from './PodsResolver';

export const PodResolvers = {
  Query: {
    pod: PodResolver,
    pods: PodsResolver,
    podLog: PodLogResolver,
  },
};
