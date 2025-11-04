import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";

export const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);

export function resolveFromScripts(...segments: string[]) {
  return path.resolve(__dirname, "..", ...segments);
}

export function resolveFromFrontend(...segments: string[]) {
  return path.resolve(__dirname, "..", "..", "..", ...segments);
}

export async function walkDir(dir: string, matcher?: (file: string) => boolean) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    if (entry.name.startsWith(".")) continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walkDir(fullPath, matcher)));
    } else if (!matcher || matcher(fullPath)) {
      files.push(fullPath);
    }
  }

  return files;
}

export async function ensureDir(dir: string) {
  await fs.mkdir(dir, { recursive: true });
}

export async function writeJson(filePath: string, data: unknown) {
  await ensureDir(path.dirname(filePath));
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf8");
}

export async function readJson<T>(filePath: string): Promise<T> {
  const raw = await fs.readFile(filePath, "utf8");
  return JSON.parse(raw) as T;
}
