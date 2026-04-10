import { spawn } from 'node:child_process';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(scriptDir, '..', '..');

const devHost = process.env.TAG_SPHERE_DEV_HOST || 'localhost';
const PORTS = { showcase: 3000 };
const children = [];
let shuttingDown = false;

function shutdown(signal = 'SIGTERM', exitCode = 0) {
  if (shuttingDown) return;
  shuttingDown = true;
  children.forEach(c => !c.killed && c.kill(signal));
  setTimeout(() => process.exit(exitCode), 250);
}

function spawnCommand({ name, cmd, args, options }) {
  const child = spawn(cmd, args, options);
  children.push(child);
  child.on('exit', (code) => {
    if (!shuttingDown && code !== 0) {
      console.error(`examples:dev failed (${name}) with code ${code ?? 1}`);
      shutdown('SIGTERM', code ?? 1);
    }
  });
}

function main() {
  const env = { ...process.env, TAG_SPHERE_DEV_HOST: devHost };
  Object.entries(PORTS).forEach(([k, v]) => {
    const key = k.toUpperCase();
    env[`TAG_SPHERE_${key}_PORT`] = String(v);
  });

  const opts = { stdio: 'inherit', shell: false, cwd: rootDir, env };
  const commands = [
    { name: 'lib', cmd: 'npm', args: ['run', 'dev'] },
    { name: 'showcase', cmd: 'npm', args: ['--prefix', 'examples', 'exec', 'vite', '--', '--config', './examples/vite.config.mjs', '--host', devHost, '--port', String(PORTS.showcase), '--strictPort'] },
  ];

  commands.forEach(c => spawnCommand({ ...c, options: opts }));
  console.log(`Examples unified dev ready: http://${devHost}:${PORTS.showcase}`);
}

process.on('SIGINT', () => shutdown('SIGINT', 0));
process.on('SIGTERM', () => shutdown('SIGTERM', 0));
main();
