import { parseWwwAuthenticate } from './RegistryClient';

test('Testing Wwww authenticate header', () => {
  const r = parseWwwAuthenticate(
    `Bearer realm="https://api.digitalocean.com/v2/registry/auth",service="registry.digitalocean.com",scope="registry:catalog:*"`,
  );

  expect(r.realm).toBe('https://api.digitalocean.com/v2/registry/auth');
  expect(r.service).toBe('registry.digitalocean.com');
  expect(r.scope).toBe('registry:catalog:*');
});
