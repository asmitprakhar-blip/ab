import { spawn } from 'node:child_process';

const port = process.env.PORT || 4173;
const command = process.platform === 'win32' ? 'npx.cmd' : 'npx';

const child = spawn(command, ['vite', 'preview', '--host', '0.0.0.0', '--port', String(port)], {
  stdio: 'inherit',
  env: process.env,
});

child.on('exit', (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }

  process.exit(code ?? 0);
});
