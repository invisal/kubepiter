import { V1ResourceRequirements } from '@kubernetes/client-node';
import { GqlAppResourceInput } from '../generated/graphql';

export default function convertAppResourceToKube(
  appResource?: GqlAppResourceInput | null,
): V1ResourceRequirements | undefined {
  if (!appResource) return undefined;

  let result: V1ResourceRequirements = {};
  let limits: Record<string, string>;
  let requests: Record<string, string>;

  // Handle the limits convention
  if (appResource.limits) {
    if (appResource.limits.cpu) {
      limits = { ...limits, cpu: appResource.limits.cpu.toString() };
    }

    if (appResource.limits.memory) {
      limits = { ...limits, memory: appResource.limits.memory.toString() + 'Mi' };
    }
  }

  if (limits) {
    result = { ...result, limits };
  }

  if (appResource.requests) {
    if (appResource.requests.cpu) {
      requests = { ...requests, cpu: appResource.requests.cpu.toString() };
    }

    if (appResource.requests.memory) {
      requests = { ...requests, memory: appResource.requests.memory.toString() + 'Mi' };
    }
  }

  if (limits) {
    result = { ...result, limits };
  }

  if (requests) {
    result = { ...result, requests };
  }

  return Object.entries(result).length > 0 ? result : undefined;
}
