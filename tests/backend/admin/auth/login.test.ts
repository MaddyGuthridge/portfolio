/**
 * Tests for POST /api/admin/auth/login
 *
 * Allows users to log into the site, enabling editing of the data.
 */
import { it, expect, beforeEach } from 'vitest';
import { setup } from '../../helpers';
import api from '$api';

let credentials: Awaited<ReturnType<typeof setup>>;

beforeEach(async () => {
  credentials = await setup();
});

it('Returns a token when correct credentials are provided', async () => {
  expect(api.admin.auth.login(credentials.username, credentials.password))
    .resolves.toStrictEqual({ token: expect.any(String) });
});

it('Blocks logins with non-existent usernames', async () => {
  expect(api.admin.auth.login(credentials.username + 'hi', credentials.password))
    .rejects.toMatchObject({ code: 401 });
});

it('Blocks logins with incorrect passwords', async () => {
  expect(api.admin.auth.login(credentials.username, credentials.password + 'hi'))
    .rejects.toMatchObject({ code: 401 });
});

/**
 * Run many failed login attempts, and ensure that there is a significant
 * difference between the times on average.
 */
it('Has random variance in the timing for failed passwords', async () => {
  let fastest = 100;
  let slowest = -1;
  // Run many logins, and check that there is more than 10ms difference between the
  // fastest and slowest
  for (let i = 0; i < 25; i++) {
    const start = Date.now();
    try {
      await api.admin.auth.login(credentials.username + 'hi', credentials.password);
      expect.unreachable('Login should have failed');
    } catch { }
    const time = Date.now() - start;
    if (time > slowest) {
      slowest = time;
    }
    if (time < fastest) {
      fastest = time;
    }
  }

  // Now make sure that the difference is big enough
  expect(slowest - fastest).toBeGreaterThanOrEqual(10);
});
