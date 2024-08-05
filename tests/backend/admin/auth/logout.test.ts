/** Test cases for POST /api/admin/auth/logout */

import api from '$endpoints';
import { expect, it } from 'vitest';
import { setup } from '../../helpers';

it("Gives an error if the server isn't setup", async () => {
  const { token } = await setup();
  await api.debug.clear();
  await expect(api.admin.auth.logout(token)).rejects.toMatchObject({ code: 400 });
});

it('Gives an error for invalid tokens', async () => {
  const { token } = await setup();
  await expect(api.admin.auth.logout(token + 'a')).rejects.toMatchObject({ code: 401 });
});

it('Gives an error for empty tokens', async () => {
  await setup();
  await expect(api.admin.auth.logout('')).rejects.toMatchObject({ code: 401 });
});

it('Invalidates tokens', async () => {
  const { token } = await setup();
  await expect(api.admin.auth.logout(token)).resolves.toStrictEqual({});
  // Now that we're logged out, logging out again should fail
  await expect(api.admin.auth.logout(token)).rejects.toMatchObject({ code: 401 });
});
