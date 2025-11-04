import path from "path";
import ts from "typescript";
import { createProgram, getSourceFiles } from "./lib/ts-utils.js";
import { resolveFromFrontend, writeJson } from "./lib/fs-utils.js";

type QueryEntry = {
  id: string;
  filePath: string;
  hook: string;
  queryKey?: string;
  options: Record<string, string>;
};

const frontendRoot = resolveFromFrontend();
const srcRoot = path.resolve(frontendRoot, "src");

function isQueryHook(name: string) {
  return [
    "useQuery",
    "useSuspenseQuery",
    "useInfiniteQuery",
    "useMutation",
    "useSuspenseInfiniteQuery",
  ].includes(name);
}

function extractObjectProperties(obj: ts.ObjectLiteralExpression) {
  const map = new Map<string, string>();
  for (const prop of obj.properties) {
    if (!ts.isPropertyAssignment(prop) || !prop.name) continue;
    const name = prop.name.getText();
    map.set(name, prop.initializer.getText());
  }
  return map;
}

async function main() {
  const { program } = createProgram();
  const entries: QueryEntry[] = [];

  for (const source of getSourceFiles(program, (sf) => sf.fileName.startsWith(srcRoot))) {
    function visit(node: ts.Node) {
      if (ts.isCallExpression(node)) {
        let hookName: string | undefined;
        if (ts.isIdentifier(node.expression)) {
          hookName = node.expression.text;
        } else if (ts.isPropertyAccessExpression(node.expression)) {
          hookName = node.expression.name.text;
        }

        if (hookName && isQueryHook(hookName)) {
          let queryKey: string | undefined;
          const options: Record<string, string> = {};
          const [first, second] = node.arguments;

          if (first && ts.isArrayLiteralExpression(first)) {
            queryKey = first.elements.map((el) => el.getText()).join(", ");
          } else if (first && ts.isObjectLiteralExpression(first)) {
            const props = extractObjectProperties(first);
            if (props.has("queryKey")) {
              queryKey = props.get("queryKey");
            }
            for (const [key, value] of props.entries()) {
              if (["queryFn", "queryKey"].includes(key)) continue;
              options[key] = value;
            }
          }

          if (!queryKey && second && ts.isObjectLiteralExpression(second)) {
            const props = extractObjectProperties(second);
            if (props.has("queryKey")) {
              queryKey = props.get("queryKey");
            }
            for (const [key, value] of props.entries()) {
              if (key === "queryKey") continue;
              options[key] = value;
            }
          }

          const relPath = path.relative(resolveFromFrontend(".."), source.fileName).replace(/\\/g, "/");
          entries.push({
            id: `${relPath}:${node.getStart(source)}`,
            filePath: relPath,
            hook: hookName,
            queryKey,
            options,
          });
        }
      }
      ts.forEachChild(node, visit);
    }

    ts.forEachChild(source, visit);
  }

  const outputPath = path.resolve(resolveFromFrontend(".."), "queries-map.json");
  await writeJson(outputPath, entries);
  console.log(`Query map written to ${outputPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
