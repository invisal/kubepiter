interface DotenvConfig {
  [key: string]: string;
}

interface ParseResult {
  env: DotenvConfig;
  exports: Set<string>;
}

const EXPORT_REGEX = /^\s*export\s+/;

function isAssignmentLine(str: string): boolean {
  return /^\s*(?:export\s+)?[a-zA-Z_][a-zA-Z_0-9 ]*\s*=/.test(str);
}

function hasSingleQuotes(str: string): boolean {
  return /^'([\s\S]*)'$/.test(str);
}

function hasDoubleQuotes(str: string): boolean {
  return /^"([\s\S]*)"$/.test(str);
}

function expandNewlines(str: string): string {
  return str.replaceAll("\\n", "\n");
}

function parseKey(lhs: string): {
  key: string;
  exported: boolean;
} {
  if (EXPORT_REGEX.test(lhs)) {
    const key = lhs.replace(EXPORT_REGEX, "");
    return { key, exported: true };
  }
  return { key: lhs, exported: false };
}

export function stringifyEnvValue(value: string) {
  const r = value.replaceAll("\n", "\\n").replaceAll("\r", "\\r");
  if (value !== r) return `"${r}"`;
  return value;
}

export function parseEnv(rawDotenv: string): ParseResult {
  const env: DotenvConfig = {};
  const exports = new Set<string>();

  for (const line of rawDotenv.split("\n")) {
    if (!isAssignmentLine(line)) continue;
    const lhs = line.slice(0, line.indexOf("=")).trim();
    const { key, exported } = parseKey(lhs);
    if (exported) {
      exports.add(key);
    }
    let value = line.slice(line.indexOf("=") + 1).trim();
    if (hasSingleQuotes(value)) {
      value = value.slice(1, -1);
    } else if (hasDoubleQuotes(value)) {
      value = value.slice(1, -1);
      value = expandNewlines(value);
    } else value = value.trim();
    env[key] = value;
  }

  return { env, exports };
}
