import { V1Secret } from '@kubernetes/client-node';
import { parseRegistrySecret } from 'src/libs/parseRegistrySecret';
import RegistryClient from 'src/libs/RegistryClient';

const cacheClient: Record<string, RegistryClient> = {};

export default function getRegistryClient(registry: V1Secret): RegistryClient {
  const base64Data = registry.data['.dockerconfigjson'];
  if (cacheClient[base64Data]) return cacheClient[base64Data];

  const { endpoint, username, password } = parseRegistrySecret(registry);

  const client = new RegistryClient({
    endpoint: endpoint.substring(0, 'http'.length) === 'http' ? endpoint : 'https://' + endpoint,
    username,
    password,
  });

  cacheClient[base64Data] = client;
  return client;
}
