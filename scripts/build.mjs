import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { buildStarter } from './artifact.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const catalogue = JSON.parse(await readFile(path.join(root, 'catalogue.json'), 'utf8'));
const starter = catalogue.starters.find((entry) => entry.id === process.argv[2]);
if (!starter || !/^[a-z0-9-]+$/.test(starter.id) || starter.directory !== `starters/${starter.id}`)
  throw new Error('[BB_STARTER_UNKNOWN] Choose an ID from catalogue.json.');
const result = await buildStarter(path.join(root, starter.directory),
  path.join(root, 'dist', `${starter.id}-${starter.version}.json`));
process.stdout.write(`${JSON.stringify({ ...result, starter: starter.id, version: starter.version })}\n`);
