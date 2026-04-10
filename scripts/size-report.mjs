import { readFileSync } from 'node:fs';
import { brotliCompressSync, constants as zlibConstants } from 'node:zlib';

const CHECK = process.argv.includes('--check');
const CORE_TARGET_BROTLI = 1300;
const CSS_TARGET_BROTLI = 400;

const files = [
  { label: 'core-esm', path: 'dist/index.js' },
  { label: 'react-esm', path: 'dist/react/index.js' },
  { label: 'styles', path: 'styles/styles.css' },
];

function formatBytes(bytes) {
  return `${bytes} B`;
}

function measure(path) {
  const raw = readFileSync(path);
  const brotli = brotliCompressSync(raw, {
    params: {
      [zlibConstants.BROTLI_PARAM_QUALITY]: 11,
    },
  });
  return { raw: raw.length, brotli: brotli.length };
}

const rows = files.map((file) => ({
  ...file,
  ...measure(file.path),
}));

console.log('Bundle Size Report (Brotli)');
for (const row of rows) {
  console.log(
    `${row.label.padEnd(9)} raw=${formatBytes(row.raw).padStart(7)} brotli=${formatBytes(row.brotli).padStart(7)}`,
  );
}

const core = rows.find((row) => row.label === 'core-esm');
const css = rows.find((row) => row.label === 'styles');

if (!core || !css) {
  process.exit(1);
}

console.log(`targets   core-esm<=${CORE_TARGET_BROTLI} B styles<=${CSS_TARGET_BROTLI} B`);

if (CHECK) {
  let failed = false;
  if (core.brotli > CORE_TARGET_BROTLI) {
    console.error(`FAIL core-esm brotli is ${core.brotli} B (target ${CORE_TARGET_BROTLI} B)`);
    failed = true;
  }
  if (css.brotli > CSS_TARGET_BROTLI) {
    console.error(`FAIL styles brotli is ${css.brotli} B (target ${CSS_TARGET_BROTLI} B)`);
    failed = true;
  }
  if (failed) process.exit(1);
  console.log('PASS size targets met');
}
