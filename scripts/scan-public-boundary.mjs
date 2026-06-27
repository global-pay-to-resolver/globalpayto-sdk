import { readFileSync, readdirSync, statSync } from "node:fs";
import { basename, join, relative } from "node:path";

const roots = [
  "README.md",
  "docs",
  "examples",
  "packages/protocol/schemas",
  "packages/protocol/src",
  "packages/sdk/src",
  "packages/provider-sdk/src",
  "packages/testing/src",
  ...packageReadmes("packages"),
];
const textFilePattern = /\.(md|mdx|mjs|ts|tsx|json)$/;
const boundaryLanguage = /\b(must not|should not|do not|does not|intentionally|out of scope|without exposing|rather than)\b/i;

const privatePatterns = [
  {
    pattern: /myPayTag\/mypaytag-private\b/i,
    message: "links or references the private resolver repo",
  },
  {
    pattern: /\.\.\/mypaytag-private\b/i,
    message: "uses a relative link into the private resolver repo",
  },
  {
    pattern: /\bmypaytag-private\/docs\//i,
    message: "references private resolver docs",
  },
  {
    pattern: /\b(SUPABASE_SERVICE_ROLE_KEY|SERVICE_ROLE_KEY|DATABASE_URL|MYPAYTAG_INTERNAL_API_SECRET)\b/,
    message: "names private backend secret variables",
  },
  {
    pattern: /\b(audit_events|hosted_actions|payment_intents|resolution_requests|route_preferences)\b/i,
    message: "names private backend storage internals",
  },
  {
    pattern: /\bRLS\b|\brow level security\b|\bservice-role\b|\bservice role\b/i,
    message: "mentions private backend access controls outside boundary language",
    allowBoundaryLanguage: true,
  },
  {
    pattern: /\bSupabase\b|\bEdge Function\b|\bmigration(s)?\b/i,
    message: "mentions private deployment or persistence wiring outside boundary language",
    allowBoundaryLanguage: true,
  },
];

const failures = [];

for (const file of listFiles(roots)) {
  const body = readFileSync(file, "utf8");
  const lines = body.split(/\r?\n/);

  lines.forEach((line, index) => {
    for (const rule of privatePatterns) {
      if (!rule.pattern.test(line)) continue;
      const context = [lines[index - 1], line, lines[index + 1]].filter(Boolean).join(" ");
      if (rule.allowBoundaryLanguage && boundaryLanguage.test(context)) continue;

      failures.push(`${file}:${index + 1}: ${rule.message}`);
    }
  });
}

if (failures.length > 0) {
  console.error("Public boundary scan failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("Public boundary scan passed.");

function listFiles(paths) {
  const files = [];

  for (const path of paths) {
    const stat = statSync(path);
    if (stat.isFile() && textFilePattern.test(path)) {
      files.push(path);
      continue;
    }

    if (stat.isDirectory()) {
      for (const child of walk(path)) files.push(child);
    }
  }

  return files.sort();
}

function walk(dir) {
  const files = [];
  for (const entry of readdirSync(dir)) {
    const path = join(dir, entry);
    const stat = statSync(path);

    if (stat.isDirectory()) {
      if (entry === "dist" || entry === "node_modules") continue;
      files.push(...walk(path));
    } else if (textFilePattern.test(path)) {
      files.push(relative(process.cwd(), path));
    }
  }

  return files;
}

function packageReadmes(dir) {
  const readmes = [];

  for (const entry of readdirSync(dir)) {
    const path = join(dir, entry);
    if (!statSync(path).isDirectory()) continue;

    for (const child of readdirSync(path)) {
      if (basename(child).toLowerCase() === "readme.md") {
        readmes.push(join(path, child));
      }
    }
  }

  return readmes;
}
