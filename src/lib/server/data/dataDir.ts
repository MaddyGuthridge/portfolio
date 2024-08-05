import path from 'path';
import fs from 'fs/promises';
import simpleGit, { CheckRepoActions, type SimpleGit } from 'simple-git';

/** Returns the path to the data repository */
export function getDataDir(): string {
  const repoPath = process.env.DATA_REPO_PATH;
  if (!repoPath) {
    throw new Error('DATA_REPO_PATH environment variable is not set');
  }
  return repoPath;
}

/**
 * Returns whether the data directory contains data that can conceivably
 * be used by the portfolio website.
 *
 * Currently, this checks for the existence of a config.json, but in the future
 * I may force it to check more thoroughly for data validity.
 */
export async function dataDirContainsData(): Promise<boolean> {
  const repoPath = getDataDir();

  // Check for config.json
  const configLocal = path.join(repoPath, 'config.json');
  try {
    await fs.access(configLocal, fs.constants.F_OK);
  } catch {
    return false;
  }
  return true;
}

/**
 * Returns whether the data directory has been initialized.
 *
 * This checks for the existence of a config.local.json.
 */
export async function dataDirIsInit(): Promise<boolean> {
  const repoPath = getDataDir();

  // Check for config.local.json
  const configLocal = path.join(repoPath, 'config.local.json');
  try {
    await fs.access(configLocal, fs.constants.F_OK);
  } catch {
    return false;
  }
  return true;
}

/** Returns whether the data directory is backed by git */
export async function dataDirUsesGit(): Promise<boolean> {
  const repoPath = getDataDir();
  const repo = simpleGit(repoPath);
  return repo.checkIsRepo(CheckRepoActions.IS_REPO_ROOT);
}
