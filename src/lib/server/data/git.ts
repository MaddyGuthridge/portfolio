import { error } from '@sveltejs/kit';
import { dataDirContainsData, dataDirIsInit, getDataDir } from './dataDir';
import simpleGit from 'simple-git';
import { readdir } from 'fs/promises';
import { rimraf } from 'rimraf';

/** Set up the data dir given a git repo URL and branch name */
export async function setupGitRepo(repo: string, branch: string | null) {
  // Check whether the data repo is set up
  if (await dataDirIsInit()) {
    throw error(403, 'Data repo is already set up');
  }

  const dir = getDataDir();

  // Set up branch options
  const options: Record<string, string> = branch === null ? {} : { '--branch': branch };

  try {
    await simpleGit().clone(repo, dir, options);
  } catch (e) {
    throw error(400, `${e}`);
  }

  // If there are files in the repo, we should validate that it is a proper
  // portfolio data repo.
  // Ignore .git, since it is included in empty repos too.
  if ((await readdir(getDataDir())).find(f => f !== '.git')) {
    if (!await dataDirContainsData()) {
      // Clean up and delete repo before giving error
      await rimraf(getDataDir());
      throw error(
        400,
        'The repo directory is non-empty, but does not contain a config.json file'
      );
    }
  }
}
