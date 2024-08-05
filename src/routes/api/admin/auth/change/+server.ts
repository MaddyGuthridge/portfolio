import { hashAndSalt, revokeSession, validateToken } from '$lib/server/auth';
import { dataDirIsInit } from '$lib/server/data/dataDir';
import { getLocalConfig, setLocalConfig } from '$lib/server/data/localConfig.js';
import { error, json } from '@sveltejs/kit';
import { nanoid } from 'nanoid';
import { object, string, validate } from 'superstruct';
import validator from 'validator';

const NewCredentials = object({
  newUsername: string(),
  oldPassword: string(),
  newPassword: string(),
});

export async function POST({ request, cookies }) {
  const token = request.headers.get('Authorization');
  if (!token) {
    return error(401, 'Authorization token is required');
  }

  if (!await dataDirIsInit()) {
    return error(400, 'Server is not initialized');
  }

  try {
    await validateToken(token);
  } catch (e) {
    return error(401, `${e}`);
  }

  const local = await getLocalConfig();

  if (!local.auth) {
    throw Error('Unreachable');
  }

  const [err, newCredentials]
    = validate(await request.json(), NewCredentials);

  if (err) {
    return error(400, `${err}`);
  }

  const { newUsername, oldPassword, newPassword } = newCredentials;

  if (!newUsername) {
    return error(400, 'New username is empty');
  }

  if (hashAndSalt(local.auth.password.salt, oldPassword) !== local.auth.password.hash) {
    return error(403, 'Old password is incorrect');
  }

  if (!validator.isStrongPassword(newPassword)) {
    return error(400, 'New password is not strong enough');
  }

  // Hash and salt new password
  const salt = nanoid();
  const hash = hashAndSalt(salt, newPassword);
  local.auth.password = {
    hash,
    salt,
  };
  // Change the username
  local.auth.username = newUsername;
  await setLocalConfig(local);

  return json({}, { status: 200 });
}
