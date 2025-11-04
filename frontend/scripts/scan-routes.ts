import path from "path";
import ts from "typescript";
import { createProgram, getSourceFiles } from "./lib/ts-utils.js";
import { resolveFromFrontend, writeJson } from "./lib/fs-utils.js";

type RouteNode = {
  id: string;
  path?: string;
  element?: string;
  lazy?: boolean;
  filePath: string;
  guards: string[];
  wrappers: string[];
  children?: RouteNode[];
};

const frontendRoot = resolveFromFrontend();
const srcRoot = path.resolve(frontendRoot, "src");

function expressionToString(expression: ts.Expression): string {
  if (ts.isJsxElement(expression) || ts.isJsxSelfClosingElement(expression)) {
    return expression.getText();
  }
  if (ts.isArrowFunction(expression) || ts.isFunctionExpression(expression)) {
    return expression.body.getText();
  }
  return expression.getText();
}

function collectRouteNodes(node: ts.ObjectLiteralExpression, source: ts.SourceFile): RouteNode {
  let pathValue: string | undefined;
  let element: string | undefined;
  let lazy = false;
  let children: RouteNode[] | undefined;
  const guards = new Set<string>();
  const wrappers = new Set<string>();

  for (const prop of node.properties) {
    if (!ts.isPropertyAssignment(prop)) continue;
    const name = prop.name?.getText();
    if (!name) continue;

    if (name === "path" && ts.isStringLiteralLike(prop.initializer)) {
      pathValue = prop.initializer.text;
    }
    if (name === "element") {
      element = expressionToString(prop.initializer);
      const text = prop.initializer.getText();
      if (text.includes("ProtectedRoute")) guards.add("ProtectedRoute");
      if (text.includes("NavGuard")) guards.add("NavGuard");
      if (text.includes("Suspense")) wrappers.add("Suspense");
      if (text.includes("ErrorBoundary")) wrappers.add("ErrorBoundary");
    }
    if (name === "lazy") {
      lazy = true;
    }
    if (name === "children" && ts.isArrayLiteralExpression(prop.initializer)) {
      children = prop.initializer.elements
        .filter(ts.isObjectLiteralExpression)
        .map((child) => collectRouteNodes(child, source));
    }
  }

  const relPath = path.relative(resolveFromFrontend(".."), source.fileName).replace(/\\/g, "/");
  return {
    id: `${relPath}:${pathValue ?? element ?? "index"}`,
    path: pathValue,
    element,
    lazy,
    filePath: relPath,
    guards: Array.from(guards),
    wrappers: Array.from(wrappers),
    children,
  };
}

async function main() {
  const { program } = createProgram();
  const routes: RouteNode[] = [];

  for (const source of getSourceFiles(program, (sf) => sf.fileName.startsWith(srcRoot))) {
    source.forEachChild((node) => {
      if (!ts.isVariableStatement(node)) return;
      const isExported = node.modifiers?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword);
      if (!isExported) return;
      for (const decl of node.declarationList.declarations) {
        if (!ts.isIdentifier(decl.name)) continue;
        if (decl.name.text !== "router") continue;
        if (!decl.initializer) continue;
        if (!ts.isCallExpression(decl.initializer)) continue;
        const [config] = decl.initializer.arguments;
        if (!config) continue;
        if (!ts.isArrayLiteralExpression(config)) continue;
        for (const element of config.elements) {
          if (ts.isObjectLiteralExpression(element)) {
            routes.push(collectRouteNodes(element, source));
          }
        }
      }
    });
  }

  const outputPath = path.resolve(resolveFromFrontend(".."), "routes-map.json");
  await writeJson(outputPath, routes);
  console.log(`Route map written to ${outputPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
