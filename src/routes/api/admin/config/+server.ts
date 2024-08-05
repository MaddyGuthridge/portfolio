import { error, json } from '@sveltejs/kit';
import { dataDirIsInit } from '$lib/server/data/dataDir';
import { validateToken } from '$lib/server/auth.js';
import { ConfigJsonStruct, getConfig, setConfig } from '$lib/server/data/config.js';
import { validate } from 'superstruct';
import consts from '$lib/consts.js';

export async function GET({ request, cookies }) {
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

  return json(
    await getConfig(),
    { status: 200 });
}

export async function PUT({ request, cookies }) {
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

  const [err, newConfig] = validate(await request.json(), ConfigJsonStruct);

  if (err) {
    return error(400, `${err}`);
  }

  if (newConfig.version !== consts.VERSION) {
    return error(
      400,
      `New version (${newConfig.version}) doesn't match server version (${consts.VERSION})`
    );
  }

  // TODO: Check for invalid mainPageGroups

  await setConfig(newConfig);

  return json({}, { status: 200 });
}
