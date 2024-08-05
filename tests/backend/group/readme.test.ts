import api from "$endpoints";
import { beforeEach, expect, it } from "vitest";
import { makeGroup, setup } from "../helpers";

let token: string;
let groupId: string;

beforeEach(async () => {
  token = (await setup()).token;
  groupId = 'group';
  await makeGroup(token, groupId);
});

it('Errors if the server is not set up', async () => {
  await api.debug.clear();
  await expect(api.group.withId(groupId).readme.get())
    .rejects.toMatchObject({ code: 400 });
  await expect(api.group.withId(groupId).readme.set(token, 'Foo'))
    .rejects.toMatchObject({ code: 400 });
});

it('Rejects README updates for invalid tokens', async () => {
  await expect(api.group.withId(groupId).readme.set('invalid', 'Foo'))
    .rejects.toMatchObject({ code: 401 });
});

it('Correctly updates the readme contents', async () => {
  await expect(api.group.withId(groupId).readme.set(token, 'Foo'))
    .resolves.toStrictEqual({});
  await expect(api.group.withId(groupId).readme.get())
    .resolves.toStrictEqual({ readme: 'Foo' });
});
