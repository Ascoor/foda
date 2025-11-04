import path from "path";
import ts from "typescript";
import { createProgram, getSourceFiles } from "./lib/ts-utils.js";
import { resolveFromFrontend, writeJson } from "./lib/fs-utils.js";

type PropInfo = {
  name: string;
  type: string;
  optional: boolean;
  defaultValue?: string;
};

type ComponentInfo = {
  name: string;
  filePath: string;
  kind: "function" | "arrow" | "forwardRef" | "memo" | "class";
  category: string;
  props: PropInfo[];
  hooks: string[];
  usesShadcn: boolean;
  usesRadix: boolean;
  memoized: boolean;
  forwardRef: boolean;
};

const frontendRoot = resolveFromFrontend();
const srcRoot = path.resolve(frontendRoot, "src");

function isComponentName(name: string | undefined) {
  if (!name) return false;
  return /^[A-Z]/.test(name);
}

function detectCategory(filePath: string) {
  const rel = path.relative(srcRoot, filePath).replace(/\\/g, "/");
  if (rel.startsWith("features/")) {
    if (rel.includes("/pages/")) return "page";
    if (rel.includes("/components/")) return "feature-component";
    return "feature";
  }
  if (rel.startsWith("routing/")) return "route";
  if (rel.startsWith("ui/")) return "ui";
  if (rel.includes("/hooks/")) return "hook";
  if (rel.includes("/contexts/")) return "context";
  return "shared";
}

function getDefaultValue(parameter: ts.ParameterDeclaration) {
  if (!parameter.initializer) return undefined;
  return parameter.initializer.getText();
}

function extractProps(
  checker: ts.TypeChecker,
  parameter: ts.ParameterDeclaration,
): PropInfo[] {
  const props: PropInfo[] = [];
  if (!parameter) return props;
  const type = checker.getTypeAtLocation(parameter);
  if (!type || !type.getProperties) return props;

  if (ts.isObjectBindingPattern(parameter.name)) {
    for (const element of parameter.name.elements) {
      if (ts.isBindingElement(element)) {
        const name = element.name.getText();
        const propSymbol = type.getProperty(name);
        let propType = "unknown";
        let optional = false;
        if (propSymbol) {
          const decl = propSymbol.valueDeclaration ?? propSymbol.declarations?.[0];
          const pType = checker.getTypeOfSymbolAtLocation(propSymbol, decl ?? parameter);
          propType = checker.typeToString(pType);
          optional = (propSymbol.getFlags() & ts.SymbolFlags.Optional) !== 0;
        }
        props.push({
          name,
          type: propType,
          optional,
          defaultValue: element.initializer?.getText(),
        });
      }
    }
  } else {
    const properties = type.getProperties();
    for (const prop of properties) {
      const decl = prop.valueDeclaration ?? prop.declarations?.[0];
      const propType = checker.getTypeOfSymbolAtLocation(prop, decl ?? parameter);
      const optional = (prop.getFlags() & ts.SymbolFlags.Optional) !== 0;
      props.push({
        name: prop.getName(),
        type: checker.typeToString(propType),
        optional,
      });
    }
  }

  return props;
}

function collectHooks(source: ts.SourceFile) {
  const hooks = new Set<string>();
  source.forEachChild((node) => {
    if (ts.isImportDeclaration(node)) {
      if (!node.importClause || !node.importClause.namedBindings) return;
      const bindings = node.importClause.namedBindings;
      if (ts.isNamedImports(bindings)) {
        for (const spec of bindings.elements) {
          const name = spec.name.text;
          if (/^use[A-Z]/.test(name)) {
            hooks.add(name);
          }
        }
      }
    }
  });
  return Array.from(hooks).sort();
}

function detectUsage(source: ts.SourceFile, matcher: (text: string) => boolean) {
  const text = source.getFullText();
  return matcher(text);
}

function analyzeComponent(
  checker: ts.TypeChecker,
  source: ts.SourceFile,
  node: ts.Node,
  name: string,
  kind: ComponentInfo["kind"],
): ComponentInfo | undefined {
  const parameter = ts.isFunctionDeclaration(node)
    ? node.parameters[0]
    : ts.isVariableDeclaration(node) && ts.isArrowFunction(node.initializer)
      ? node.initializer.parameters[0]
      : undefined;

  const props = parameter ? extractProps(checker, parameter) : [];
  const hooks = collectHooks(source);
  const filePath = path.relative(resolveFromFrontend(".."), source.fileName).replace(/\\/g, "/");
  const usesShadcn = detectUsage(source, (text) => text.includes("@/ui") || text.includes("@/infrastructure/shared/ui"));
  const usesRadix = detectUsage(source, (text) => text.includes("@radix-ui"));
  const memoized = detectUsage(source, (text) => /memo\(/.test(text));
  const forwardRef = detectUsage(source, (text) => /forwardRef\(/.test(text));

  return {
    name,
    filePath,
    kind,
    category: detectCategory(source.fileName),
    props,
    hooks,
    usesShadcn,
    usesRadix,
    memoized,
    forwardRef,
  };
}

function hasJsx(node: ts.Node): boolean {
  let found = false;
  function visit(n: ts.Node) {
    if (ts.isJsxElement(n) || ts.isJsxSelfClosingElement(n) || ts.isJsxFragment(n)) {
      found = true;
      return;
    }
    ts.forEachChild(n, visit);
  }
  visit(node);
  return found;
}

async function main() {
  const { program, checker } = createProgram();
  const components: ComponentInfo[] = [];

  for (const source of getSourceFiles(program, (sf) => sf.fileName.startsWith(srcRoot))) {
    source.forEachChild((node) => {
      if (ts.isFunctionDeclaration(node) && (ts.getCombinedModifierFlags(node) & ts.ModifierFlags.Export)) {
        const name = node.name?.text;
        if (isComponentName(name) && hasJsx(node)) {
          components.push(analyzeComponent(checker, source, node, name!, "function")!);
        }
      }

      if (ts.isVariableStatement(node)) {
        const isExported = node.modifiers?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword);
        if (!isExported) return;
        for (const decl of node.declarationList.declarations) {
          if (!ts.isIdentifier(decl.name)) continue;
          const name = decl.name.text;
          if (!isComponentName(name)) continue;
          if (!decl.initializer) continue;

          if (ts.isArrowFunction(decl.initializer) && hasJsx(decl.initializer)) {
            components.push(analyzeComponent(checker, source, decl, name, "arrow")!);
          } else if (
            ts.isCallExpression(decl.initializer) &&
            decl.initializer.arguments.length > 0
          ) {
            const calleeText = decl.initializer.expression.getText();
            const inner = decl.initializer.arguments[0];
            if (hasJsx(inner)) {
              let kind: ComponentInfo["kind"] = "forwardRef";
              if (calleeText.includes("memo")) {
                kind = "memo";
              }
              components.push(analyzeComponent(checker, source, decl, name, kind)!);
            }
          }
        }
      }

      if (ts.isClassDeclaration(node) && (ts.getCombinedModifierFlags(node) & ts.ModifierFlags.Export)) {
        const name = node.name?.text;
        if (isComponentName(name)) {
          components.push(analyzeComponent(checker, source, node, name!, "class")!);
        }
      }
    });
  }

  const outputPath = path.resolve(resolveFromFrontend(".."), "component-inventory.json");
  await writeJson(outputPath, components.sort((a, b) => a.name.localeCompare(b.name)));
  console.log(`Component inventory written to ${outputPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
