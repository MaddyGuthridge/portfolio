/**
 * Test cases for POST /api/admin/auth/disable
 */
import { it, expect } from 'vitest';
import { setup } from '../../helpers';
import api from '$endpoints';

it('Disables authentication', async () => {
  const { token, username, password } = await setup();
  await expect(api.admin.auth.disable(token, password)).resolves.toStrictEqual({});
  // Logging in should fail
  await expect(api.admin.auth.login(username, password))
    .rejects.toMatchObject({ code: 403 });
  // And any operation using the token should also fail
  // Technically, this should be a 403, since no value can ever be successful,
  // but I don't want to add another code path
  await expect(api.admin.auth.logout(token)).rejects.toMatchObject({ code: 401 });
});

it('Errors for invalid tokens', async () => {
  const { password } = await setup();
  await expect(api.admin.auth.disable('invalid', password))
    .rejects.toMatchObject({ code: 401 });
});

it('Errors for incorrect passwords', async () => {
  const { token } = await setup();
  await expect(api.admin.auth.disable(token, 'incorrect'))
    .rejects.toMatchObject({ code: 403 });
});

it('Errors if the data is not set up', async () => {
  const { token, password } = await setup();
  await api.debug.clear();
  await expect(api.admin.auth.disable(token, password))
    .rejects.toMatchObject({ code: 400 });
});
