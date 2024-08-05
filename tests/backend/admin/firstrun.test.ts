/**
 * Test cases for POST /api/admin/repo
 */
import api from '$endpoints';
import gitRepos from '../gitRepos';
import { it, test, describe, expect, vi, beforeEach } from 'vitest';
import simpleGit, { CheckRepoActions } from 'simple-git';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { DATA_REPO_PATH as DATA_PATH } from '$env/static/private';
import consts from '$lib/consts';

// Git clone takes a while, increase the test timeout
vi.setConfig({ testTimeout: 15_000 });

const REPO_PATH = process.env.DATA_REPO_PATH;

const repo = () => simpleGit(REPO_PATH);

describe('POST /api/admin/repo', () => {
  describe('git', () => {
    it('Clones repo to the default branch when URL is provided', async () => {
      await api.admin.firstrun(gitRepos.TEST_REPO_RW, null);
      await expect(repo().checkIsRepo(CheckRepoActions.IS_REPO_ROOT)).resolves.toStrictEqual(true);
      // Default branch for this repo is 'main'
      await expect(repo().status()).resolves.toMatchObject({ current: 'main' });
    });

    it("Gives an error if the repo doesn't contain a config.json, but isn't empty", async () => {
      await expect(
        api.admin.firstrun(gitRepos.NON_PORTFOLIO, null)
      ).rejects.toMatchObject({ code: 400 });
    }, 10000);

    it("Doesn't give an error if the repository is entirely empty", async () => {
      await api.admin.firstrun(gitRepos.EMPTY, null);
      await expect(repo().checkIsRepo(CheckRepoActions.IS_REPO_ROOT)).resolves.toStrictEqual(true);
    });

    it('Checks out a branch when one is given', async () => {
      await api.admin.firstrun(gitRepos.TEST_REPO_RW, 'example');
      // Check branch name matches
      await expect(repo().status()).resolves.toMatchObject({ current: 'example' });
    });

    it('Gives an error if the repo URL cannot be cloned', async () => {
      await expect(
        api.admin.firstrun(gitRepos.INVALID, null)
      ).rejects.toMatchObject({ code: 400 });
    });
  });

  it('Gives auth credentials on success', async () => {
    await expect(api.admin.firstrun(null, null))
      .resolves.toMatchObject({
        credentials: {
          username: 'admin',
          password: expect.any(String),
          token: expect.any(String),
        }
      });
  });

  it('Blocks access if data is already set up', async () => {
    await api.admin.firstrun(null, null);
    await expect(
      api.admin.firstrun(gitRepos.TEST_REPO_RW, null)
    ).rejects.toMatchObject({ code: 403 });
  });

  it("Doesn't clone repo when no URL provided", async () => {
    await api.admin.firstrun(null, null);
    await expect(repo().checkIsRepo(CheckRepoActions.IS_REPO_ROOT)).resolves.toStrictEqual(false);
  });

  describe('Sets up required starting files', () => {
    let firstRun: Awaited<ReturnType<typeof api.admin.firstrun>>;
    beforeEach(async () => {
      firstRun = await api.admin.firstrun(null, null);
    });

    test('config.local.json', async () => {
      const now = Math.floor(Date.now() / 1000);
      const config = await readFile(path.join(DATA_PATH, 'config.local.json'), { encoding: 'utf-8' });

      expect(JSON.parse(config)).toStrictEqual({
        auth: {
          username: firstRun.credentials.username,
          password: {
            // Don't expect anything specific here
            hash: expect.any(String),
            salt: expect.any(String),
          },
          sessions: {
            notBefore: expect.toBeWithin(now - 1, now + 1),
            revokedSessions: {},
          },
        },
        version: consts.VERSION,
      });
    });

    test('config.json', async () => {

    });
  });

  it.todo('Leaves the .gitignore as-is if config.local.json is already there');
});
