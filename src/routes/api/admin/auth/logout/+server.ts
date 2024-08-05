import { revokeSession } from '$lib/server/auth';
import { dataDirIsInit } from '$lib/server/data/dataDir';
import { error, json } from '@sveltejs/kit';

export async function POST({ request, cookies }) {
  const token = request.headers.get('Authorization');
  if (!token) {
    return error(401, 'Authorization token is required');
  }

  if (!await dataDirIsInit()) {
    return error(400, 'Server is not initialized');
  }

  try {
    await revokeSession(token);
  } catch (e) {
    return error(401, `${e}`);
  }

  return json({}, { status: 200 });
}
