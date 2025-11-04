import path from "path";
import ts from "typescript";
import { createProgram, getSourceFiles } from "./lib/ts-utils.js";
import { resolveFromFrontend, writeJson, readJson, walkDir } from "./lib/fs-utils.js";

type I18nCoverage = {
  usedKeys: string[];
  missing: Record<string, string[]>;
  unused: Record<string, string[]>;
  duplicated: string[];
  mismatchedInterpolation: Record<string, string[]>;
};

const frontendRoot = resolveFromFrontend();
const srcRoot = path.resolve(frontendRoot, "src");
const localesDir = path.resolve(frontendRoot, "src/infrastructure/i18n/locales");

function flattenJson(obj: Record<string, unknown>, prefix = ""): Record<string, string> {
  const result: Record<string, string> = {};
  for (const [key, value] of Object.entries(obj)) {
    const newKey = prefix ? `${prefix}.${key}` : key;
    if (value && typeof value === "object") {
      Object.assign(result, flattenJson(value as Record<string, unknown>, newKey));
    } else {
      result[newKey] = String(value ?? "");
    }
  }
  return result;
}

function extractInterpolationTokens(value: string) {
  const tokens = new Set<string>();
  const matches = value.match(/{{(.*?)}}/g) ?? [];
  for (const match of matches) {
    tokens.add(match.slice(2, -2).trim());
  }
  return Array.from(tokens).sort();
}

async function loadLocales() {
  const files = await walkDir(localesDir, (file) => file.endsWith(".json"));
  const locales: Record<string, Record<string, string>> = {};
  for (const file of files) {
    const locale = path.basename(file, ".json");
    const data = await readJson<Record<string, unknown>>(file);
    locales[locale] = flattenJson(data);
  }
  return locales;
}

async function main() {
  const { program } = createProgram();
  const locales = await loadLocales();
  const usedKeys = new Set<string>();
  const duplicates = new Set<string>();

  for (const source of getSourceFiles(program, (sf) => sf.fileName.startsWith(srcRoot))) {
    function visit(node: ts.Node) {
      if (ts.isCallExpression(node)) {
        let isTranslator = false;
        if (ts.isIdentifier(node.expression) && node.expression.text === "t") {
          isTranslator = true;
        } else if (
          ts.isPropertyAccessExpression(node.expression) &&
          node.expression.name.text === "t"
        ) {
          isTranslator = true;
        }

        if (isTranslator) {
          const [arg] = node.arguments;
          if (arg && ts.isStringLiteralLike(arg)) {
            const key = arg.text;
            if (usedKeys.has(key)) {
              duplicates.add(key);
            }
            usedKeys.add(key);
          }
        }
      }
      ts.forEachChild(node, visit);
    }

    ts.forEachChild(source, visit);
  }

  const missing: Record<string, string[]> = {};
  const unused: Record<string, string[]> = {};
  const mismatchedInterpolation: Record<string, string[]> = {};

  for (const [locale, map] of Object.entries(locales)) {
    const localeKeys = new Set(Object.keys(map));
    const missingKeys = Array.from(usedKeys).filter((key) => !localeKeys.has(key));
    const unusedKeys = Array.from(localeKeys).filter((key) => !usedKeys.has(key));
    missing[locale] = missingKeys.sort();
    unused[locale] = unusedKeys.sort();
  }

  const localeEntries = Object.entries(locales);
  for (const [key] of localeEntries[0]?.[1] ? Object.entries(localeEntries[0][1]) : []) {
    const referenceTokens = extractInterpolationTokens(localeEntries[0][1][key]);
    for (const [locale, strings] of localeEntries) {
      if (!(key in strings)) continue;
      const tokens = extractInterpolationTokens(strings[key]);
      if (tokens.join("|") !== referenceTokens.join("|")) {
        if (!mismatchedInterpolation[key]) {
          mismatchedInterpolation[key] = [];
        }
        mismatchedInterpolation[key].push(locale);
      }
    }
  }

  const output: I18nCoverage = {
    usedKeys: Array.from(usedKeys).sort(),
    missing,
    unused,
    duplicated: Array.from(duplicates).sort(),
    mismatchedInterpolation,
  };

  const outputPath = path.resolve(resolveFromFrontend(".."), "i18n-coverage.json");
  await writeJson(outputPath, output);
  console.log(`i18n coverage written to ${outputPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
