/**
 * Test cases for DELETE /api/debug/clear
 */
import api from '$endpoints';
import { getDataDir } from '$lib/server/data/dataDir';
import { access } from 'fs/promises';
import { it, expect } from 'vitest';
import { setup } from '../helpers';

it('Removes all content from the data directory', async () => {
  await api.debug.clear();
  // Data directory should be all gone, meaning accessing it fails
  await expect(access(getDataDir())).toReject();
});

it('Removes the login credentials', async () => {
  const credentials = await setup();
  await api.debug.clear();
  // Logging in should fail
  await expect(api.admin.auth.login(credentials.username, credentials.password)).toReject();
  // And logging out with our token should as well
  await expect(api.admin.auth.logout(credentials.token)).toReject();
});
