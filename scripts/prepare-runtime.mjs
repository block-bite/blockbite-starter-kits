import { lstat, mkdir, copyFile, readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const [id, archive] = process.argv.slice(2);
const root = fileURLToPath(new URL('../', import.meta.url));
const catalogue = JSON.parse(await readFile(path.join(root, 'catalogue.json'), 'utf8'));
if (!catalogue.starters.some((entry) => entry.id === id) || !archive || !path.isAbsolute(archive))
  throw new Error('Usage: node scripts/prepare-runtime.mjs miette /absolute/path/blockbite-astro.tgz');
const info = await lstat(archive);
if (!info.isFile() || info.isSymbolicLink() || info.size > 30_000_000)
  throw new Error('Choose an ordinary BlockBite setup archive under 30 MB.');
const target = path.join(root, 'starters', id, '.blockbite/packages');
for (const folder of [path.dirname(target), target]) {
  try {
    const info = await lstat(folder);
    if (!info.isDirectory() || info.isSymbolicLink())
      throw new Error('[BB_STARTER_RUNTIME_PATH] Use an ordinary .blockbite/packages folder without symlinks.');
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
    await mkdir(folder);
  }
}
await copyFile(archive, path.join(target, 'blockbite-astro.tgz'), 1);
process.stdout.write('Runtime archive prepared. Run npm install in the starter to trust and install its dependencies.\n');
