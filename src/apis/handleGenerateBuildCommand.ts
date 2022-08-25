import withAttachApp from './withAttachedApp';

function escapeShell(cmd: string) {
  return '"' + cmd.replace(/(["'$`\\])/g, '\\$1') + '"';
}

const handleGenerateBuildCommand = withAttachApp(({ app, res }) => {
  const nextVersion = app.version + 1;
  const args = app.env ? ' ' + app.env.map((e) => `--build-arg ${e.name}=${escapeShell(e.value)}`).join(' ') : '';

  return res.send(
    [
      `#!/bin/bash`,
      `docker build -t ${app.image}:${nextVersion}${args} .`,
      `docker push ${app.image}:${nextVersion}`,
    ].join('\n'),
  );
});

export default handleGenerateBuildCommand;
