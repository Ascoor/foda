#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';

const spec = process.env.OPENAPI_SPEC || 'http://127.0.0.1:8000/api/documentation.json';
const outputPath = process.env.FRONTEND_TYPES_OUTPUT || 'src/types/generated.ts';

const ensureOutputDir = () => {
  const dir = dirname(outputPath);
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
};

ensureOutputDir();

const result = spawnSync('npx', ['openapi-typescript', spec, '--output', outputPath], {
  stdio: 'inherit',
  shell: true,
  env: process.env,
});

if (result.status !== 0) {
  console.warn('\u26a0\ufe0f  Falling back to placeholder OpenAPI type generation.');
  const placeholder = `// Auto-generated placeholder file. Replace with real OpenAPI output.\nexport type GeneratedApiTypes = Record<string, unknown>;\n`;
  writeFileSync(outputPath, placeholder);
  process.exit(0);
}
