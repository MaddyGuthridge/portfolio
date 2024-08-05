/**
 * Test cases for GET /api/admin/config
 *
 * Returns the current site configuration.
 */
import api from '$endpoints';
import { beforeEach, expect, it } from 'vitest';
import { setup } from '../../helpers';
import consts from '$lib/consts';

let token: string;

beforeEach(async () => {
  token = (await setup()).token;
});

it('Returns the current config contents', async () => {
  await expect(api.admin.config.get(token)).resolves.toStrictEqual({
    siteName: 'My portfolio',
    listedGroups: [],
    version: consts.VERSION,
  });
});

it('Errors if given an invalid token', async () => {
  await expect(api.admin.config.get('invalid token'))
    .rejects.toMatchObject({ code: 401 });
});

it("Errors if the data isn't set up", async () => {
  await api.debug.clear();
  await expect(api.admin.config.get('invalid token'))
    .rejects.toMatchObject({ code: 400 });
});
