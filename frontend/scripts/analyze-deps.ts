import { spawn } from "child_process";
import path from "path";
import { resolveFromFrontend, writeJson } from "./lib/fs-utils.js";

function stripAnsi(value: string) {
  return value.replace(/\u001b\[[0-9;]*m/g, "");
}

function runCommand(command: string, args: string[], allowedExitCodes: number[] = [0]) {
  return new Promise<string>((resolve, reject) => {
    const proc = spawn(command, args, {
      cwd: resolveFromFrontend(),
      stdio: ["ignore", "pipe", "inherit"],
      env: {
        ...process.env,
        FORCE_COLOR: "1",
      },
    });

    let output = "";
    proc.stdout.on("data", (data) => {
      output += data.toString();
    });

    proc.on("close", (code) => {
      if (code === null) {
        reject(new Error(`${command} exited due to signal`));
        return;
      }
      if (!allowedExitCodes.includes(code)) {
        reject(new Error(`${command} exited with code ${code}`));
      } else {
        resolve(output);
      }
    });
  });
}

async function main() {
  const frontendRoot = resolveFromFrontend();
  console.log("Running madge...");
  const madgeArgs = [
    "madge",
    "src",
    "--json",
    "--ts-config",
    "tsconfig.app.json",
    "--extensions",
    "ts,tsx",
    "--no-spinner",
    "--no-color",
  ];
  const madgeOutput = await runCommand("npx", madgeArgs);
  const madgeData = JSON.parse(madgeOutput);

  const orphansOutput = await runCommand(
    "npx",
    [
      "madge",
      "src",
      "--orphans",
      "--ts-config",
      "tsconfig.app.json",
      "--extensions",
      "ts,tsx",
      "--no-spinner",
      "--no-color",
    ],
  );
  const orphans = orphansOutput
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("Processed"))
    .map(stripAnsi);

  const circularOutput = await runCommand(
    "npx",
    [
      "madge",
      "src",
      "--circular",
      "--ts-config",
      "tsconfig.app.json",
      "--extensions",
      "ts,tsx",
      "--no-spinner",
      "--no-color",
    ],
  );
  const circular = circularOutput.includes("No circular dependency")
    ? []
    : circularOutput
        .split("\n\n")
        .map((section) => section.trim())
        .filter((section) => section && !section.startsWith("Processed"))
        .map(stripAnsi);

  console.log("Running depcheck...");
  const depcheckOutput = await runCommand("npx", ["depcheck", "--json"], [0, 255]);
  const depcheckData = JSON.parse(depcheckOutput);

  const outputPath = path.resolve(resolveFromFrontend(".."), "dependency-analysis.json");
  await writeJson(outputPath, {
    generatedAt: new Date().toISOString(),
    madge: madgeData,
    orphans,
    circular,
    depcheck: depcheckData,
  });

  console.log(`Dependency analysis written to ${outputPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
