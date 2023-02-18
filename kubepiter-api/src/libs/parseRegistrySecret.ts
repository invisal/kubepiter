import { V1Secret } from '@kubernetes/client-node';

export function parseRegistrySecret(registry: V1Secret): {
  endpoint: string;
  username: string;
  password: string;
} {
  const base64Data = registry.data['.dockerconfigjson'];
  const decode = JSON.parse(Buffer.from(base64Data, 'base64').toString());
  const auths = decode.auths;
  const endpoint = Object.keys(auths)[0];
  const authBase64 = auths[endpoint].auth;
  const [username, password] = Buffer.from(authBase64, 'base64').toString().split(':');

  return {
    endpoint,
    username,
    password,
  };
}
