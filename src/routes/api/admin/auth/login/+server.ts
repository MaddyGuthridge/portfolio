import { generateToken, hashAndSalt } from '$lib/server/auth.js';
import { dataDirIsInit } from '$lib/server/data/dataDir';
import { getLocalConfig } from '$lib/server/data/localConfig.js';
import { error, json } from '@sveltejs/kit';

const FAIL_DURATION = 50;

/**
 * Promise that resolves in a random amount of time, used to get some timing
 * invariance.
 */
const sleepRandom = () => new Promise<void>((r) => setTimeout(r, Math.random() * FAIL_DURATION));

/**
 * Throw a 401 after a random (small) amount of time, so that timing attacks
 * cannot be used reliably.
 */
async function fail(timer: Promise<void>) {
  await timer;
  return error(401, 'The username or password is incorrect');
}

export async function POST({ request, cookies }) {
  if (!await dataDirIsInit()) {
    return error(400, 'Server is not initialized');
  }

  const local = await getLocalConfig();

  if (!local.auth) {
    error(403, 'Logging in has been disabled by the administrator');
  }

  const { username, password } = await request.json();

  const failTimer = sleepRandom();

  if (username !== local.auth.username) {
    return fail(failTimer);
  }

  if (hashAndSalt(local.auth.password.salt, password) !== local.auth.password.hash) {
    return fail(failTimer);
  }

  return json({ token: generateToken() }, { status: 200 });
}
