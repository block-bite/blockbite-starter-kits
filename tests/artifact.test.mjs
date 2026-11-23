import assert from 'node:assert/strict';
import { cp, mkdtemp, readFile, rm, symlink, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { readStarter, buildStarter } from '../scripts/artifact.mjs';

const source = fileURLToPath(new URL('../starters/miette/', import.meta.url));
async function fixture(t) {
  const root = await mkdtemp(path.join(tmpdir(), 'miette-kit-'));
  t.after(() => rm(root, { recursive: true, force: true }));
  await cp(source, path.join(root, 'source'), { recursive: true, filter: (file) => !file.includes('node_modules') && !file.includes('/.blockbite') });
  return { root, source: path.join(root, 'source') };
}

test('the distribution contains local photos, articles and an independent saved brand', async () => {
  const files = await readStarter(source);
  const brand = JSON.parse(Buffer.from(files['brand/brand.json'], 'base64'));
  assert.equal(brand.document.definition.identity.name, 'Miette Club');
  for (const asset of brand.files) assert.ok(files[`brand/assets/${asset.filename}`]);
  assert.ok(files['public/images/croissants.jpg']);
  assert.ok(files['src/pages/le-journal/[slug].astro']);
  assert.equal(Object.keys(files).filter((name) => name.endsWith('.md') && name.includes('/articles/')).length, 3);
  assert.ok(Object.keys(files).every((name) => !/node_modules|\.blockbite|\.original|siteboard\//.test(name)));
});

test('traversal and symlink input leave an existing release intact', async (t) => {
  const f = await fixture(t);
  const output = path.join(f.root, 'release.json');
  await buildStarter(f.source, output);
  const before = await readFile(output);
  await writeFile(path.join(f.source, 'files.json'), JSON.stringify(['../secret.txt']));
  await assert.rejects(buildStarter(f.source, output), /BB_STARTER_INVALID/);
  assert.deepEqual(await readFile(output), before);
  await writeFile(path.join(f.source, 'files.json'), JSON.stringify(['STARTER.md']));
  await rm(path.join(f.source, 'STARTER.md'));
  await symlink(path.join(source, 'STARTER.md'), path.join(f.source, 'STARTER.md'));
  await assert.rejects(buildStarter(f.source, output), /BB_STARTER_INVALID.*link/);
  assert.deepEqual(await readFile(output), before);
});
