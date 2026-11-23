import assert from 'node:assert/strict';
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { readStarter } from '../scripts/artifact.mjs';

const source = fileURLToPath(new URL('../starters/shifft/', import.meta.url));

test('SHIFFT ships its homepage, movement scenes and owned Brand Guide assets', async () => {
  const files = await readStarter(source);
  assert.ok(files['src/pages/index.astro']);
  const read = (file) => Buffer.from(files[file], 'base64').toString('utf8');
  const { scenes, pageFlows } = JSON.parse(read('siteboard/scenes.json'));
  for (const flow of Object.values(pageFlows)) {
    assert.ok(files[flow.page], `Missing page ${flow.page}`);
    for (const beat of flow.beats) {
      assert.ok(files[beat.source], `Missing island ${beat.source}`);
      if (beat.scene) assert.equal(scenes[beat.scene].source, beat.source);
    }
  }
  const collection = scenes.collection;
  const island = read(collection.source);
  assert.equal(collection.frames.length, 3);
  for (const selector of [collection.group, ...collection.frames.map((frame) => frame.element)]) {
    assert.ok(selector.startsWith('#') && island.includes(`id="${selector.slice(1)}"`), selector);
  }
  const brand = JSON.parse(Buffer.from(files['brand/brand.json'], 'base64'));
  assert.equal(brand.document.definition.identity.name, 'SHIFFT');
  for (const asset of brand.files) assert.ok(files[`brand/assets/${asset.filename}`]);
  assert.deepEqual(Object.keys(files).filter((name) => name.startsWith('siteboard/')), ['siteboard/scenes.json']);
});

test('the scene exception keeps other Siteboard and backup paths private', async (t) => {
  const root = await mkdtemp(path.join(tmpdir(), 'shifft-kit-'));
  t.after(() => rm(root, { recursive: true, force: true }));
  await mkdir(path.join(root, 'siteboard'));
  for (const file of ['draft.json', 'scenes.json.bak', 'scenesXjson', '.private.json']) {
    const relative = `siteboard/${file}`;
    await writeFile(path.join(root, relative), '{}');
    await writeFile(path.join(root, 'files.json'), JSON.stringify([relative]));
    await assert.rejects(readStarter(root), /BB_STARTER_INVALID.*unsupported path/);
  }
});
