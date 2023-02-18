export default function generateNameAlias(name: string, retry: number): string {
  // Remove all special characters
  let alias = name
    .replace(/[^\w\d \-_]/gi, '')
    .toLowerCase()
    .trim();

  // Remove _ and space to dash
  alias = alias.replace(/[ _]/gi, '-');

  // Remove sequential dash
  alias = alias.split('-').filter(Boolean).join('-');

  return alias + (retry > 0 ? `-${retry + 1}` : '');
}
