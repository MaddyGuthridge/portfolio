/** Git repository endpoints */
import { apiFetch } from '../fetch';

/** Information about the repo */
export type RepoInfo = {
  /** Object if repo exists, or null otherwise */
  repo: {
    /** The repo URL */
    url: string
    /** The current branch */
    branch: string
    /** The current commit hash */
    commit: string
    /** Whether the repository has any uncommitted changes */
    clean: boolean
  } | null,
};

/**
 * Retrieve information about the data repository.
 *
 * @param token The authentication token
 */
export const get = async (token: string) => {
  return apiFetch(
    'GET',
    '/api/admin/repo',
    token,
  ) as Promise<RepoInfo>;
};

const repo = {
  get,
};

export default repo;
