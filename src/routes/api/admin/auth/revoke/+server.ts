import { revokeSession, validateToken } from '$lib/server/auth';
import { dataDirIsInit } from '$lib/server/data/dataDir';
import { getLocalConfig, setLocalConfig } from '$lib/server/data/localConfig.js';
import { unixTime } from '$lib/util.js';
import { error, json } from '@sveltejs/kit';

export async function POST({ request, cookies }) {
  const token = request.headers.get('Authorization');
  if (!token) {
    return error(401, 'Authorization token is required');
  }

  if (!await dataDirIsInit()) {
    return error(400, 'Server is not initialized');
  }

  const local = await getLocalConfig();

  if (!local.auth) {
    return error(403, 'Authentication was disabled');
  }

  try {
    await validateToken(token);
  } catch (e) {
    return error(401, `${e}`);
  }

  local.auth.sessions.notBefore = unixTime();

  await setLocalConfig(local);

  return json({}, { status: 200 });
}
