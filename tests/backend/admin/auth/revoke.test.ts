/**
 * Test cases for POST /api/admin/auth/revoke
 */
import { it, expect } from 'vitest';
import { setup } from '../../helpers';
import api from '$endpoints';

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

it('Revokes the current token', async () => {
  const { token, username, password } = await setup();
  const { token: token2 } = await api.admin.auth.login(username, password);
  // Wait a second, since otherwise the token will have been created at the new
  // notBefore time
  await sleep(1000);
  await expect(api.admin.auth.revoke(token)).resolves.toStrictEqual({});
  // Both the current and a second token were revoked
  await expect(api.admin.auth.logout(token)).toReject();
  await expect(api.admin.auth.logout(token2)).toReject();
  // If we create a new token, it works correctly
  const { token: token3 } = await api.admin.auth.login(username, password);
  await expect(api.admin.auth.logout(token3)).toResolve();
});

it('Fails for invalid tokens', async () => {
  await setup();
  await expect(api.admin.auth.revoke('invalid')).toReject();
});

it('Gives a 400 when no data directory is set up', async () => {
  const { token } = await setup();
  await api.debug.clear();
  await expect(api.admin.auth.revoke(token)).rejects.toMatchObject({ code: 400 });
});
