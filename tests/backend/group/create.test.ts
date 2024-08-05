
import { beforeEach, describe, expect, it, test } from 'vitest';
import { setup } from '../helpers';
import api from '$endpoints';
import type { GroupInfoFull } from '$lib/server/data/group';
import { invalidGroupIds, invalidGroupNames, validGroupIds, validGroupNames } from '../consts';

let token: string;

beforeEach(async () => {
  token = (await setup()).token;
});

describe('Sets up basic group properties', async () => {
  const groupId = 'my-group';
  let info: GroupInfoFull;
  beforeEach(async () => {
    await api.group.withId(groupId).create(token, 'Group name', 'Group description');
    info = await api.group.withId(groupId).info.get();
  });

  test('Name matches', () => {
    expect(info.name).toStrictEqual('Group name');
  });

  test('Description matches', () => {
    expect(info.description).toStrictEqual('Group description');
  });

  it('Chooses a random color for the group', () => {
    expect(info.color).toSatisfy((s: string) => /^#[0-9a-f]{6}$/.test(s));
  });

  it('Readme contains group name and group description', async () => {
    await expect(api.group.withId(groupId).readme.get())
      .resolves.toStrictEqual({ readme: '# Group name\n\nGroup description\n' });
  });
});

describe('Group ID', () => {
  // Invalid group IDs
  it.each(invalidGroupIds)('Rejects invalid group IDs ($case)', async ({ id }) => {
    await expect(api.group.withId(id).create(token, 'Example group', ''))
      .rejects.toMatchObject({ code: 400 });
  });

  // Valid group IDs
  it.each(validGroupIds)('Allows valid group IDs ($case)', async ({ id }) => {
    await expect(api.group.withId(id).create(token, 'My group', ''))
      .toResolve();
  });

  it('Fails if a group with a matching ID already exists', async () => {
    await api.group.withId('my-group').create(token, 'My group', '');
    // ID of this group matches
    await expect(api.group.withId('my-group').create(token, 'My other group', ''))
      .rejects.toMatchObject({ code: 400 });
  });
});

describe('Group name', () => {
  // Invalid group names
  it.each(invalidGroupNames)('Rejects invalid group names ($case)', async ({ name }) => {
    await expect(api.group.withId('my-group').create(token, name, ''))
      .rejects.toMatchObject({ code: 400 });
  });

  // Valid group names
  it.each(validGroupNames)('Allows valid group names ($case)', async ({ name }) => {
    await expect(api.group.withId('my-group').create(token, name, ''))
      .toResolve();
  });
});

it('Fails for invalid tokens', async () => {
  await expect(api.group.withId('id').create('invalid token', 'My group', ''))
    .rejects.toMatchObject({ code: 401 });
});

it('Fails if the data is not set up', async () => {
  await api.debug.clear();
  await expect(api.group.withId('id').create(token, 'My group', ''))
    .rejects.toMatchObject({ code: 400 });
});
