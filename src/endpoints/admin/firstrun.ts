/** Git repository endpoints */
import type { FirstRunCredentials } from '$lib/server/auth';
import { apiFetch } from '../fetch';

/**
 * Set up the site's data repository.
 *
 * @param repoUrl The clone URL of the git repo
 * @param branch The branch to check-out
 */
export default async function (
  repoUrl: string | null,
  branch: string | null,
) {
  return apiFetch(
    'POST',
    '/api/admin/firstrun',
    undefined,
    { repoUrl, branch },
  ) as Promise<{ credentials: FirstRunCredentials, firstTime: boolean }>;
}
