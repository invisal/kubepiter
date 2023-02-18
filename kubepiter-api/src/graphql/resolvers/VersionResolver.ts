import pkg from './../../../package.json';

export default function VersionResolver() {
  return pkg.version;
}
