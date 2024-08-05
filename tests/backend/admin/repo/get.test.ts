/**
 * Test cases for GET /api/admin/repo
 */
import { it, expect } from 'vitest';
import { setup } from '../../helpers';
import api from '$endpoints';
import gitRepos from '../../gitRepos';
import simpleGit from 'simple-git';
import { getDataDir } from '$lib/server/data/dataDir';

it('Blocks unauthorized users', async () => {
  await setup();
  await expect(api.admin.repo.get('')).rejects.toMatchObject({ code: 401 });
});

it('Gives a 400 when no data directory is set up', async () => {
  const { token } = await setup();
  await api.debug.clear();
  await expect(api.admin.repo.get(token)).rejects.toMatchObject({ code: 400 });
});

it('Correctly returns repo info when a repo is set up', { timeout: 15_000 }, async () => {
  const { token } = (await api.admin.firstrun(gitRepos.TEST_REPO_RW, null)).credentials;
  const repo = simpleGit(getDataDir());
  await expect(api.admin.repo.get(token)).resolves.toStrictEqual({
    repo: {
      url: gitRepos.TEST_REPO_RW,
      branch: 'main',
      commit: await repo.revparse(['--short', 'HEAD']),
      clean: true,
    }
  });
});

it('Correctly returns null info when a repo is not set up', async () => {
  const { token } = await setup();
  await expect(api.admin.repo.get(token)).resolves.toStrictEqual({
    repo: null,
  });
});
