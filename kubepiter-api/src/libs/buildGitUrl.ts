import { URL } from 'url';

export default function buildGitUrl(
  url: string,
  branch: string | undefined,
  auth?: {
    username?: string;
    password?: string;
  },
) {
  if (url.indexOf('https://') === 0) {
    url = 'git://' + url.substring('https://'.length);
  }

  if (url.indexOf('http://') === 0) {
    url = 'git://' + url.substring('http://'.length);
  }

  const builder = new URL(url);

  if (auth?.username) {
    builder.username = auth.username;
  }

  if (auth?.password) {
    builder.password = auth.password;
  }

  if (branch) {
    builder.hash = `refs/heads/${branch}`;
  }

  return builder.href;
}

// git://github.com/groupincorp/l192-notification.git#refs/heads/develop
