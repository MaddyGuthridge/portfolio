
import { it, expect, test } from 'vitest';
import { setup } from '../helpers';
import api from '$endpoints';
import gitRepos from '../gitRepos';

test('No groups exist by default', async () => {
  await setup();
  await expect(api.group.list()).resolves.toStrictEqual({});
});

it.todo('Lists existing groups');

it('Ignores the .git directory', async () => {
  await api.admin.firstrun(gitRepos.TEST_REPO_RW, null);
  await expect(api.group.list()).resolves.toStrictEqual({});
});

it("Errors when the server hasn't been set up", async () => {
  await expect(api.group.list()).rejects.toMatchObject({ code: 400 });
});
