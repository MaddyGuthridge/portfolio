import { error, json } from '@sveltejs/kit';
import { dataDirIsInit } from '$lib/server/data/dataDir';
import { getGroupInfo, getGroupReadme, setGroupReadme } from '$lib/server/data/group';
import { validateToken } from '$lib/server/auth';
import { assert, object, string, StructError, validate } from 'superstruct';

export async function GET({ params, request, cookies }) {
  if (!await dataDirIsInit()) {
    return error(400, 'Server is not initialized');
  }

  const groupId = params.groupId;

  try {
    return json({ readme: await getGroupReadme(groupId) }, { status: 200 });
  } catch (e) {
    return error(400, `Group with ID ${groupId} doesn't exist\n${e}`);
  }
}

export async function PUT({ params, request, cookies }) {
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

  const groupId = params.groupId;

  try {
    await getGroupInfo(groupId);
  } catch (e) {
    return error(400, `Group with ID ${groupId} doesn't exist\n${e}`);
  }

  let readme: string;
  try {
    const newReadme = (await request.json()).readme;
    assert(newReadme, string());
    readme = newReadme;
  } catch (e) {
    return error(400, `${e}`);
  }

  await setGroupReadme(groupId, readme);

  return json({}, { status: 200 });
}
