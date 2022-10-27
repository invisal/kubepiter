import buildGitUrl from './buildGitUrl';

test('Testing Git URL transform', () => {
  expect(buildGitUrl('https://github.com/ubuntu/ubuntu-make.git', undefined)).toBe(
    'git://github.com/ubuntu/ubuntu-make.git',
  );

  // Testing with username and password
  expect(
    buildGitUrl('https://github.com/ubuntu/ubuntu-make.git', undefined, { username: 'admin', password: '123' }),
  ).toBe('git://admin:123@github.com/ubuntu/ubuntu-make.git');

  // Testing with branch
  expect(
    buildGitUrl('https://github.com/ubuntu/ubuntu-make.git', 'develop', { username: 'admin', password: '123' }),
  ).toBe('git://admin:123@github.com/ubuntu/ubuntu-make.git#refs/heads/develop');
});
