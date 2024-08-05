import { ChildProcess, spawn } from 'node:child_process';
import dotenv from 'dotenv';
import fs from 'node:fs';
import api from '$endpoints';
dotenv.config();

let server: ChildProcess | undefined;

const waitTime = 10_000;

const serverLog = 'server.log';

/** Start the server if required */
export async function setup() {
  const HOST = process.env.HOST;
  const PORT = process.env.PORT;

  // Send a test request
  try {
    await api.debug.echo('Wait for server startup');
    // If it succeeded, there is no need to start the server, it is already
    // running
    return;
  } catch {
    // It failed, start up the server
  }

  if (!HOST) {
    throw Error('HOST is undefined');
  }
  if (!PORT) {
    throw Error('PORT is undefined');
  }

  const logStream = fs.createWriteStream(serverLog);

  server = spawn('npm', ['run', 'dev', '--', '--host', HOST, '--port', PORT]);

  server.stdout?.pipe(logStream);
  server.stderr?.pipe(logStream);

  const start = Date.now();

  while (Date.now() - start < waitTime) {
    try {
      await api.debug.echo('Wait for server startup');
      return;
    } catch { }
  }
  // If we reach this point, the server failed to start in-time
  server.kill('SIGTERM');
  console.error('Server failed to start');
  process.exit(1);
}

export function teardown() {
  server?.kill('SIGINT');
}
