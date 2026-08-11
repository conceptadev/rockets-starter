#!/usr/bin/env node
/**
 * NestJS 12 alpha packages ship ESM-only `exports` (import condition only).
 * CJS consumers (this starter + Jest) need a `default`/`require` condition.
 * Re-run after every yarn install.
 */
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');

/** @type {ReadonlyArray<string>} */
const targets = [
  'node_modules/@nestjs/config/package.json',
];

/**
 * @param {string} relativePath
 */
function patchExports(relativePath) {
  const filePath = path.join(root, relativePath);
  if (!fs.existsSync(filePath)) {
    console.warn(`[patch-nestjs-alpha] skip missing ${relativePath}`);
    return;
  }

  const pkg = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const entry = pkg.exports?.['.'];
  if (!entry || typeof entry !== 'object') {
    return;
  }

  const main = typeof entry.import === 'string' ? entry.import : './dist/index.js';
  let changed = false;

  if (entry.default !== main) {
    entry.default = main;
    changed = true;
  }
  if (entry.require !== main) {
    entry.require = main;
    changed = true;
  }

  if (changed) {
    pkg.exports['.'] = entry;
    fs.writeFileSync(filePath, `${JSON.stringify(pkg, null, 2)}\n`);
    console.log(`[patch-nestjs-alpha] patched ${relativePath}`);
  }
}

for (const target of targets) {
  patchExports(target);
}
