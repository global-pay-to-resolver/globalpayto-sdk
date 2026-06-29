import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { execFileSync } from "node:child_process";

const specPath = resolve("api/openapi.yaml");
const outputPath = resolve("api/postman_collection.json");

mkdirSync(dirname(outputPath), { recursive: true });

execFileSync(
  "pnpm",
  [
    "exec",
    "openapi2postmanv2",
    "--spec",
    specPath,
    "--output",
    outputPath,
    "--pretty",
    "--options",
    "schemaFaker=false",
  ],
  { stdio: "inherit" },
);

const collection = JSON.parse(readFileSync(outputPath, "utf8"));

const removeGeneratedIds = (value) => {
  if (Array.isArray(value)) {
    value.forEach(removeGeneratedIds);
    return;
  }

  if (!value || typeof value !== "object") {
    return;
  }

  delete value.id;
  delete value._postman_id;
  Object.values(value).forEach(removeGeneratedIds);
};

const normalizeJsonExample = (value) => {
  if (Array.isArray(value)) {
    return value.map(normalizeJsonExample);
  }

  if (!value || typeof value !== "object") {
    if (typeof value === "number") return "<number>";
    if (typeof value === "boolean") return "<boolean>";
    return typeof value === "string" ? "<string>" : value;
  }

  return Object.fromEntries(
    Object.entries(value).map(([key, nestedValue]) => [key, normalizeJsonExample(nestedValue)]),
  );
};

const normalizeGeneratedExamples = (value) => {
  if (Array.isArray(value)) {
    value.forEach(normalizeGeneratedExamples);
    return;
  }

  if (!value || typeof value !== "object") {
    return;
  }

  if (typeof value.raw === "string" && /^[\s\n]*[{[]/.test(value.raw)) {
    value.raw = JSON.stringify(normalizeJsonExample(JSON.parse(value.raw)), null, 2);
  }

  if (value.type === "any" && typeof value.key === "string" && typeof value.value === "string") {
    value.value = `<${value.key}>`;
  }

  if (typeof value.body === "string" && /^[\s\n]*[{[]/.test(value.body)) {
    value.body = JSON.stringify(normalizeJsonExample(JSON.parse(value.body)), null, 2);
  }

  Object.values(value).forEach(normalizeGeneratedExamples);
};

removeGeneratedIds(collection);
normalizeGeneratedExamples(collection);

if (collection?.info?.schema !== "https://schema.getpostman.com/json/collection/v2.1.0/collection.json") {
  throw new Error("Generated file is not a Postman Collection v2.1 document.");
}

if (!Array.isArray(collection.item) || collection.item.length === 0) {
  throw new Error("Generated Postman collection does not contain any requests.");
}

writeFileSync(outputPath, `${JSON.stringify(collection, null, 2)}\n`);

console.log(`Generated ${outputPath}`);
