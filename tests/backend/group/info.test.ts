import api from "$endpoints";
import { beforeEach, expect, it } from "vitest";
import { createCustomGroupProperties, makeGroup, setup } from "../helpers";
import { describe } from "node:test";
import { invalidGroupNames, validGroupNames } from "../consts";

let token: string;
let groupId: string;

beforeEach(async () => {
  token = (await setup()).token;
  groupId = 'group';
  await makeGroup(token, groupId);
});

it('Gives an error if the server is not set up', async () => {
  await api.debug.clear();
  await expect(api.group.withId(groupId).info.get())
    .rejects.toMatchObject({ code: 400 });
    await expect(api.group.withId(groupId).info.set(token, createCustomGroupProperties()))
      .rejects.toMatchObject({ code: 400 });
});

it('Gives an error for invalid tokens', async () => {
  await expect(api.group.withId(groupId).info.set('invalid', createCustomGroupProperties()))
    .rejects.toMatchObject({ code: 401 });
});

it('Successfully updates the group info', async () => {
  await expect(api.group.withId(groupId).info.set(token, createCustomGroupProperties()))
    .toResolve();
  await expect(api.group.withId(groupId).info.get())
    .resolves.toStrictEqual(createCustomGroupProperties());
});

describe('Group name', async () => {
  // Invalid group names
  it.each(invalidGroupNames)('Rejects invalid group names ($case)', async ({ name }) => {
    await expect(api.group.withId(groupId).info.set(token, createCustomGroupProperties({ name })))
      .rejects.toMatchObject({ code: 400 });
  });

  // Valid group names
  it.each(validGroupNames)('Allows valid group names ($case)', async ({ name }) => {
    await expect(api.group.withId(groupId).info.set(token, createCustomGroupProperties({ name })))
      .toResolve();
  });
});
