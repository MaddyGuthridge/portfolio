import { json } from '@sveltejs/kit';
import { dataDirContainsData, getDataDir } from '$lib/server/data/dataDir.js';
import { mkdir } from 'fs/promises';
import { setupGitRepo } from '$lib/server/data/git.js';
import { authSetup } from '$lib/server/auth.js';
import { initConfig } from '$lib/server/data/config.js';

export async function POST({ request, cookies }) {
  const { repoUrl, branch }: { repoUrl: string | null, branch: string | null }
    = await request.json();

  // If we were given a repoUrl, set it up
  if (repoUrl) {
    await setupGitRepo(repoUrl, branch);
  } else {
    // Otherwise, just create the data dir empty
    await mkdir(getDataDir());
  }

  // Now set up auth
  const credentials = await authSetup();

  /**
   * Whether the data repo is empty -- true if data dir was empty before
   * firstrun.
   */
  let firstTime = false;

  // If data dir is empty, set up default configuration
  if (!await dataDirContainsData()) {
    firstTime = true;
    await initConfig();
  }

  return json({ credentials, firstTime }, { status: 200 });
}
