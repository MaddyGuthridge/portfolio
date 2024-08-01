/** Git repository endpoints */
import type { FirstRunCredentials } from '$types/firstrun';
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
): Promise<FirstRunCredentials> {
  return apiFetch(
    'POST',
    '/api/admin/firstrun',
    undefined,
    { repoUrl, branch },
  ) as Promise<FirstRunCredentials>;
}
