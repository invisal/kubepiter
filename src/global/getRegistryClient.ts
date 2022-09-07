import { V1Secret } from '@kubernetes/client-node';
import RegistryClient from 'src/libs/RegistryClient';

const cacheClient: Record<string, RegistryClient> = {};

export default function getRegistryClient(registry: V1Secret): RegistryClient {
  const base64Data = registry.data['.dockerconfigjson'];
  if (cacheClient[base64Data]) return cacheClient[base64Data];

  const decode = JSON.parse(Buffer.from(base64Data, 'base64').toString());
  const auths = decode.auths;
  const endpoint = Object.keys(auths)[0];
  const authBase64 = auths[endpoint].auth;
  const [username, password] = Buffer.from(authBase64, 'base64').toString().split(':');

  const client = new RegistryClient({
    endpoint: endpoint.substring(0, 'http'.length) === 'http' ? endpoint : 'https://' + endpoint,
    username,
    password,
  });

  cacheClient[base64Data] = client;
  return client;
}
