import { URL } from 'url';
import fetch from 'cross-fetch';

interface RegistryClientOptions {
  endpoint: string;
  username?: string;
  password?: string;
}

interface RegistryRepositoryList {
  repositories: string[];
}

interface RegistryTagList {
  name: string;
  tags: string[];
}

export function parseWwwAuthenticate(text: string): Record<string, string> {
  if (text.substring(0, 'Bearer '.length) !== 'Bearer ') {
    throw new Error('Invalid authenticate header');
  }

  const auth = text.substring('Bearer '.length);
  const convertToJsonString = '{"' + auth.replace(/="/g, `":"`).replace(/",/g, `","`) + '}';
  return JSON.parse(convertToJsonString);
}

// https://docs.docker.com/registry/spec/api/
export default class RegistryClient {
  protected options: RegistryClientOptions;
  protected tokenCacheByKeys: Record<string, string> = {};

  constructor(options: RegistryClientOptions) {
    this.options = options;
  }

  protected async request<T>(
    method: string,
    path: string,
    headers?: Record<string, string>,
  ): Promise<{ data: T; headers: Headers }> {
    const cacheKey = `${method}_${path}`;
    const href = new URL(path, this.options.endpoint).href;
    const response = await fetch(href, {
      method,
      headers: this.tokenCacheByKeys[cacheKey]
        ? {
            Authorization: 'Bearer ' + this.tokenCacheByKeys[cacheKey],
            ...headers,
          }
        : headers,
    });

    if (response.status >= 200 && response.status < 300) {
      return {
        data: await response.json(),
        headers: response.headers,
      };
    }

    if (!response.headers.get('www-authenticate')) {
      throw new Error(response.statusText);
    }

    // Finish the challenge
    const challenge = parseWwwAuthenticate(response.headers.get('www-authenticate'));
    const challengeResponse = await fetch(
      challenge.realm + '?' + new URLSearchParams({ service: challenge.service, scope: challenge.scope }),
      {
        headers: {
          Authorization: 'Basic ' + Buffer.from(this.options.username + ':' + this.options.password).toString('base64'),
        },
      },
    );

    // Fail challenge
    if (challengeResponse.status !== 200) {
      throw new Error(challengeResponse.statusText);
    }

    const challengeResponseJson: { token: string } = await challengeResponse.json();
    const token = challengeResponseJson.token;

    // Retry with new token
    const responseRetry = await fetch(href, {
      method,
      headers: {
        Authorization: 'Bearer ' + token,
        ...headers,
      },
    });

    if (responseRetry.status < 200 || responseRetry.status >= 300) {
      throw new Error(responseRetry.statusText);
    }

    this.tokenCacheByKeys[cacheKey] = token;
    return {
      data: await responseRetry.json(),
      headers: responseRetry.headers,
    };
  }

  async listRepositories() {
    return await this.request<RegistryRepositoryList>('GET', '/v2/_catalog');
  }

  async listTags(repositoryName: string) {
    return await this.request<RegistryTagList>('GET', `/v2/${repositoryName}/tags/list`);
  }

  async manifests(
    repositoryName: string,
    reference: string,
    mediaType?:
      | 'application/vnd.docker.distribution.manifest.v2+json'
      | 'application/vnd.docker.distribution.manifest.list.v2+json',
  ) {
    return await this.request(
      'GET',
      `/v2/${repositoryName}/manifests/${reference}`,
      mediaType
        ? {
            Accept: mediaType,
          }
        : {},
    );
  }

  async deleteManifest(repositoryName: string, reference: string) {
    return await this.request('DELETE', `/v2/${repositoryName}/manifests/${reference}`);
  }
}
