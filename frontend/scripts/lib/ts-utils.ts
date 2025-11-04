import ts from "typescript";
import path from "path";
import { resolveFromFrontend } from "./fs-utils.js";

export function createProgram() {
  const frontendRoot = resolveFromFrontend();
  const configPath = path.resolve(frontendRoot, "tsconfig.app.json");
  const configFile = ts.readConfigFile(configPath, ts.sys.readFile);
  if (configFile.error) {
    throw new Error(ts.formatDiagnosticsWithColorAndContext([configFile.error], {
      getCanonicalFileName: (fileName) => fileName,
      getCurrentDirectory: () => process.cwd(),
      getNewLine: () => "\n",
    }));
  }

  const parsed = ts.parseJsonConfigFileContent(
    configFile.config,
    ts.sys,
    frontendRoot,
    { noEmit: true },
  );

  const program = ts.createProgram({
    options: parsed.options,
    rootNames: parsed.fileNames,
  });

  return { program, checker: program.getTypeChecker() };
}

export function getSourceFiles(program: ts.Program, predicate?: (sf: ts.SourceFile) => boolean) {
  const files = program
    .getSourceFiles()
    .filter((sf) => !sf.isDeclarationFile && !sf.fileName.includes("node_modules"));

  return predicate ? files.filter(predicate) : files;
}

export function getJsxComponentName(node: ts.Node): string | undefined {
  if (ts.isJsxOpeningLikeElement(node)) {
    const tag = node.tagName.getText();
    return tag;
  }
  return undefined;
}

export function expressionToText(expression: ts.Expression): string {
  return expression.getText();
}
