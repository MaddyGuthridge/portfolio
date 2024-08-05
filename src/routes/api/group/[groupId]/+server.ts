import { error, json } from '@sveltejs/kit';
import { dataDirIsInit } from '$lib/server/data/dataDir';
import { createGroup, getGroupInfo, GroupInfoFullStruct, setGroupInfo } from '$lib/server/data/group';
import { validateToken } from '$lib/server/auth';
import { object, string, StructError, validate } from 'superstruct';

export async function GET({ params, request, cookies }) {
  if (!await dataDirIsInit()) {
    return error(400, 'Server is not initialized');
  }

  const groupId = params.groupId;

  try {
    return json(await getGroupInfo(groupId), { status: 200 });
  } catch (e) {
    return error(400, `Group with ID ${groupId} doesn't exist\n${e}`);
  }
}

/** Regex for matching group IDs */
const groupIdValidator = /^[a-z0-9-.]+$/;

const illegalNameChars = ['\t', '\n', '\f', '\r'];

export async function POST({ params, request, cookies }) {
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

  // Validate group ID
  const groupId = params.groupId;

  if (!groupId.trim().length) {
    return error(400, `Group ID '${groupId}' is empty`);
  }
  if (!groupIdValidator.test(groupId)) {
    return error(400, `Group ID '${groupId}' is contains illegal characters`);
  }
  if (groupId.startsWith('.')) {
    return error(400, `Group ID '${groupId}' has a leading dot`);
  }
  if (groupId.endsWith('.')) {
    return error(400, `Group ID '${groupId}' has a trailing dot`);
  }
  if (groupId.startsWith('-')) {
    return error(400, `Group ID '${groupId}' has a leading dash`);
  }
  if (groupId.endsWith('-')) {
    return error(400, `Group ID '${groupId}' has a trailing dash`);
  }

  const [err, body] = validate(await request.json(), object({ name: string(), description: string() }));
  if (err) {
    return error(400, err);
  }
  const { name, description } = body;

  // Validate name
  if (!name) {
    return error(400, 'Name cannot be empty');
  }
  if (name.trim().length !== name.length) {
    return error(400, 'Name cannot contain leading or trailing whitespace');
  }
  if (
    illegalNameChars
      .reduce((n, c) => n.replace(c, ''), name)
      .length
    !== name.length
  ) {
    return error(400, 'Name contains illegal whitespace characters');
  }

  let groupDataExists = false;
  try {
    await getGroupInfo(groupId);
    groupDataExists = true;
  } catch (e) {
    // If it's a validation error, we should say so
    if (e instanceof StructError) {
      return error(400, `Group with ID ${groupId} already exists, but has invalid data`);
    }
  }
  if (groupDataExists) {
    return error(400, `Group with ID ${groupId} already exists`);
  }

  await createGroup(groupId, name, description);

  return json({}, { status: 200 });
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

  const [err, info] = validate(await request.json(), GroupInfoFullStruct);

  if (err) {
    return error(400, err);
  }

  // Validate name
  const name = info.name;
  if (!name) {
    return error(400, 'Name cannot be empty');
  }
  if (name.trim().length !== name.length) {
    return error(400, 'Name cannot contain leading or trailing whitespace');
  }
  if (
    illegalNameChars
      .reduce((n, c) => n.replace(c, ''), name)
      .length
    !== name.length
  ) {
    return error(400, 'Name contains illegal whitespace characters');
  }

  // TODO: Other validation

  await setGroupInfo(groupId, info);

  return json({}, { status: 200 });
}
