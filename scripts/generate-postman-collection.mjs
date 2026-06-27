import { mkdirSync, readFileSync } from "node:fs";
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
  ],
  { stdio: "inherit" },
);

const collection = JSON.parse(readFileSync(outputPath, "utf8"));

if (collection?.info?.schema !== "https://schema.getpostman.com/json/collection/v2.1.0/collection.json") {
  throw new Error("Generated file is not a Postman Collection v2.1 document.");
}

if (!Array.isArray(collection.item) || collection.item.length === 0) {
  throw new Error("Generated Postman collection does not contain any requests.");
}

console.log(`Generated ${outputPath}`);
