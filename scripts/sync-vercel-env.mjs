import { readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";

function parseEnv(source) {
  const values = new Map();
  for (const rawLine of source.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const separator = line.indexOf("=");
    if (separator < 1) continue;
    const name = line.slice(0, separator).trim();
    let value = line.slice(separator + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    values.set(name, value);
  }
  return values;
}

function setVercelEnv(name, value, { sensitive = false, environments = "production,preview,development" } = {}) {
  if (!value) throw new Error(`${name} is empty`);
  const args = [
    "env", "add", name, environments,
    "--value", value, "--force", "--yes",
    sensitive ? "--sensitive" : "--no-sensitive"
  ];
  const result = spawnSync("vercel", args, { cwd: process.cwd(), encoding: "utf8" });
  if (result.status !== 0) throw new Error(`Unable to set ${name}: ${result.stderr || result.stdout}`);
  console.log(`Configured ${name}`);
}

const local = parseEnv(readFileSync(".env.local", "utf8"));
const required = [
  ["NEXT_PUBLIC_SUPABASE_URL", false],
  ["NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY", false],
  ["SUPABASE_SERVICE_ROLE_KEY", true],
  ["GEMINI_API_KEY", true]
];

for (const [name, sensitive] of required) {
  setVercelEnv(name, local.get(name), { sensitive });
}

setVercelEnv("NEXT_PUBLIC_APP_URL", "https://emptyhanded.app");
setVercelEnv("EMAIL_FROM", "EmptyHanded <reminders@emptyhanded.app>");
