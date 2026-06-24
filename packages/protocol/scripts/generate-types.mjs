import { compile } from "json-schema-to-typescript";
import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const schemaDir = path.join(root, "schemas");
const generatedDir = path.join(root, "src", "generated");
const generatedTypesDir = path.join(generatedDir, "types");

const schemaFiles = (await readdir(schemaDir))
  .filter((file) => file.endsWith(".schema.json"))
  .sort();

const schemas = [];
await mkdir(generatedTypesDir, { recursive: true });

for (const file of schemaFiles) {
  const schemaPath = path.join(schemaDir, file);
  const schema = JSON.parse(await readFile(schemaPath, "utf8"));
  schemas.push({ file, schema });
  const typeSource = await compile(schema, schema.title, {
    additionalProperties: false,
    bannerComment: "",
    style: {
      semi: true,
      singleQuote: false,
    },
  });
  const typeFile = file.replace(".schema.json", ".ts");
  await writeFile(
    path.join(generatedTypesDir, typeFile),
    `/* eslint-disable */\n// Generated from packages/protocol/schemas/${file}. Do not edit by hand.\n\n${typeSource.trim()}\n`,
  );
}

const schemaEntries = schemas
  .map(({ file, schema }) => {
    const name = file
      .replace(".schema.json", "")
      .replace(/(^|-)([a-z])/g, (_match, _dash, letter) => letter.toUpperCase());
    return `export const ${name}Schema = ${JSON.stringify(schema, null, 2)} as const;`;
  })
  .join("\n\n");

const schemaMap = schemas
  .map(({ file }) => {
    const name = file
      .replace(".schema.json", "")
      .replace(/(^|-)([a-z])/g, (_match, _dash, letter) => letter.toUpperCase());
    const key = file.replace(".schema.json", "");
    return `  "${key}": ${name}Schema,`;
  })
  .join("\n");

await writeFile(
  path.join(generatedDir, "schemas.ts"),
  `/* eslint-disable */\n// Generated from packages/protocol/schemas. Do not edit by hand.\n\n${schemaEntries}\n\nexport const protocolSchemas = {\n${schemaMap}\n} as const;\n`,
);

const typeExports = schemas
  .map(({ file, schema }) => {
    const moduleName = file.replace(".schema.json", ".js");
    return `export type { ${schema.title} } from "./types/${moduleName}";`;
  })
  .join("\n");

await writeFile(
  path.join(generatedDir, "types.ts"),
  `/* eslint-disable */\n// Generated from packages/protocol/schemas. Do not edit by hand.\n\n${typeExports}\n`,
);
