import { createHash } from 'node:crypto';
import { lstat, readFile, mkdir, rename, writeFile } from 'node:fs/promises';
import path from 'node:path';

const asset = '[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}';
const admitted = new RegExp(`^(?:(?:src|public)/[a-zA-Z0-9_./\\[\\]-]+|siteboard/scenes\\.json|brand/brand\\.json|brand/assets/${asset}\\.(?:svg|png|jpg|webp|woff2)|STARTER\\.md|LICENSE)$`);
const fail = (message) => new Error(`[BB_STARTER_INVALID] ${message}`);
export const revision = (files) => createHash('sha256').update(JSON.stringify(files)).digest('hex');

/** A release is an explicit set of inert source bytes; no dependency scripts run. */
export async function readStarter(root) {
  root = path.resolve(root);
  const manifest = path.join(root, 'files.json');
  const manifestInfo = await lstat(manifest);
  if (!manifestInfo.isFile() || manifestInfo.isSymbolicLink() || manifestInfo.size > 128_000)
    throw fail('Use an ordinary distribution manifest.');
  const paths = JSON.parse(await readFile(manifest, 'utf8'));
  if (!Array.isArray(paths) || paths.length > 120 || new Set(paths).size !== paths.length)
    throw fail('Use up to 120 unique allowlisted files.');
  const files = {};
  let total = 0;
  for (const relative of paths) {
    if (typeof relative !== 'string' || !admitted.test(relative) ||
        relative.split('/').some((part) => !part || part.startsWith('.') || ['node_modules', 'dist'].includes(part)) ||
        relative.includes('.blockbite-')) throw fail('The manifest contains an unsupported path.');
    const filename = path.join(root, relative);
    for (let cursor = filename; ; cursor = path.dirname(cursor)) {
      if ((await lstat(cursor)).isSymbolicLink()) throw fail(`Do not link ${relative}.`);
      if (cursor === root) break;
    }
    const info = await lstat(filename);
    if (!info.isFile() || info.size > 2_000_000) throw fail(`Use a bounded ordinary file for ${relative}.`);
    const bytes = await readFile(filename);
    total += bytes.length;
    if (bytes.length > 2_000_000 || total > 10_000_000) throw fail('The source bundle is too large.');
    files[relative] = bytes.toString('base64');
  }
  return files;
}

export async function buildStarter(root, destination) {
  const files = await readStarter(root);
  const bytes = Buffer.from(JSON.stringify({ version: 1, revision: revision(files), files }) + '\n');
  await mkdir(path.dirname(destination), { recursive: true });
  const temporary = `${destination}.${process.pid}.tmp`;
  await writeFile(temporary, bytes);
  await rename(temporary, destination);
  return { file: path.basename(destination), bytes: bytes.length, files: Object.keys(files).length,
    sha256: createHash('sha256').update(bytes).digest('hex') };
}
