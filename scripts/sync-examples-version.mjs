import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);

const ROOT_PACKAGE = resolve(process.cwd(), 'package.json');
const EXAMPLES_PACKAGE = resolve(process.cwd(), 'examples/package.json');
const PACKAGE_NAME = 'tag-sphere';

async function readJson(path) {
  const content = await readFile(path, 'utf8');
  return JSON.parse(content);
}

function formatJson(value) {
  return `${JSON.stringify(value, null, 2)}\n`;
}

async function npmView(spec, field) {
  const { stdout } = await execFileAsync('npm', ['view', spec, field, '--json'], {
    env: process.env,
  });
  const trimmed = stdout.trim();
  if (!trimmed) return null;
  return JSON.parse(trimmed);
}

async function resolvePublishedVersion(rootVersion) {
  const scoped = `${PACKAGE_NAME}@${rootVersion}`;
  try {
    const published = await npmView(scoped, 'version');
    if (published === rootVersion) {
      return { version: rootVersion, source: 'root-version' };
    }
  } catch {
    // Fallback to latest below.
  }

  const latest = await npmView(PACKAGE_NAME, 'dist-tags.latest');
  if (typeof latest !== 'string' || latest.length === 0) {
    throw new Error('Unable to resolve dist-tags.latest for tag-sphere');
  }

  return { version: latest, source: 'dist-tags.latest' };
}

async function main() {
  const rootPkg = await readJson(ROOT_PACKAGE);
  const examplesPkg = await readJson(EXAMPLES_PACKAGE);

  const rootVersion = rootPkg.version;
  if (typeof rootVersion !== 'string' || rootVersion.length === 0) {
    throw new Error('Root package.json is missing a valid version field');
  }

  const { version, source } = await resolvePublishedVersion(rootVersion);

  if (!examplesPkg.dependencies || typeof examplesPkg.dependencies !== 'object') {
    examplesPkg.dependencies = {};
  }

  const previous = examplesPkg.dependencies[PACKAGE_NAME];
  examplesPkg.dependencies[PACKAGE_NAME] = version;

  await writeFile(EXAMPLES_PACKAGE, formatJson(examplesPkg), 'utf8');

  if (source === 'root-version') {
    console.log(`examples: synced ${PACKAGE_NAME} to published root version ${version}`);
  } else {
    console.warn(
      `examples: root version ${rootVersion} is not published; using ${PACKAGE_NAME}@${version} from dist-tags.latest`,
    );
  }

  if (previous !== version) {
    console.log(`examples: updated dependency ${PACKAGE_NAME}: ${previous ?? '(none)'} -> ${version}`);
  } else {
    console.log(`examples: dependency ${PACKAGE_NAME} already at ${version}`);
  }
}

main().catch((error) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`examples:sync-version failed: ${message}`);
  process.exit(1);
});
