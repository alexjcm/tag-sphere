import { spawn } from 'node:child_process';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(scriptDir, '..', '..');

const devHost = process.env.TAG_SPHERE_DEV_HOST || 'localhost';
const PORTS = {
  showcase: Number(process.env.TAG_SPHERE_SHOWCASE_PORT || 3000),
  vanilla: Number(process.env.TAG_SPHERE_VANILLA_PORT || 5174),
  react: Number(process.env.TAG_SPHERE_REACT_PORT || 5175),
  astro: Number(process.env.TAG_SPHERE_ASTRO_PORT || 5176),
};

const children = [];
let shuttingDown = false;

function shutdown(signal = 'SIGTERM', exitCode = 0) {
  if (shuttingDown) return;
  shuttingDown = true;

  for (const child of children) {
    if (!child.killed) child.kill(signal);
  }

  setTimeout(() => process.exit(exitCode), 250);
}

function spawnCommand(command) {
  const child = spawn(command.cmd, command.args, command.options);

  children.push(child);

  child.on('exit', (code) => {
    if (shuttingDown) return;
    if (code === 0) return;
    console.error(`examples:dev failed (${command.name}) with code ${code ?? 1}`);
    shutdown('SIGTERM', code ?? 1);
  });
}

function main() {
  const sharedEnv = {
    ...process.env,
    TAG_SPHERE_DEV_HOST: devHost,
    TAG_SPHERE_SHOWCASE_PORT: String(PORTS.showcase),
    TAG_SPHERE_VANILLA_PORT: String(PORTS.vanilla),
    TAG_SPHERE_REACT_PORT: String(PORTS.react),
    TAG_SPHERE_ASTRO_PORT: String(PORTS.astro),
    VITE_TAG_SPHERE_DEV_HOST: devHost,
    VITE_TAG_SPHERE_VANILLA_PORT: String(PORTS.vanilla),
    VITE_TAG_SPHERE_REACT_PORT: String(PORTS.react),
    VITE_TAG_SPHERE_ASTRO_PORT: String(PORTS.astro),
  };

  const commands = [
    {
      name: 'vanilla',
      cmd: 'npm',
      args: ['--prefix', 'examples', 'run', 'dev:vanilla', '--', '--host', devHost, '--port', String(PORTS.vanilla), '--strictPort'],
      options: { stdio: 'inherit', shell: false, cwd: rootDir, env: sharedEnv },
    },
    {
      name: 'react',
      cmd: 'npm',
      args: ['--prefix', 'examples', 'run', 'dev:react', '--', '--host', devHost, '--port', String(PORTS.react), '--strictPort'],
      options: { stdio: 'inherit', shell: false, cwd: rootDir, env: sharedEnv },
    },
    {
      name: 'astro',
      cmd: 'npm',
      args: ['--prefix', 'examples', 'run', 'dev:astro', '--', '--host', devHost, '--port', String(PORTS.astro), '--strictPort'],
      options: { stdio: 'inherit', shell: false, cwd: rootDir, env: sharedEnv },
    },
    {
      name: 'showcase',
      cmd: 'npm',
      args: ['--prefix', 'examples', 'exec', 'vite', '--', '--config', './examples/showcase/vite.config.mjs', '--host', devHost, '--port', String(PORTS.showcase), '--strictPort'],
      options: { stdio: 'inherit', shell: false, cwd: rootDir, env: sharedEnv },
    },
  ];

  for (const command of commands) {
    spawnCommand(command);
  }

  console.log(`Examples unified dev ready: http://${devHost}:${PORTS.showcase}`);
}

process.on('SIGINT', () => shutdown('SIGINT', 0));
process.on('SIGTERM', () => shutdown('SIGTERM', 0));

main();
