/**
 * Test cases for PUT /api/admin/config
 *
 * Allows users to edit the site configuration
 */
import { beforeEach, expect, it } from 'vitest';
import { setup } from '../../helpers';
import api from '$endpoints';
import consts from '$lib/consts';

let token: string;

beforeEach(async () => {
  token = (await setup()).token;
});

it('Updates the current config contents', async () => {
  await expect(api.admin.config.put(token, {
    siteName: 'Name changed',
    listedGroups: [],
    version: consts.VERSION,
  })).resolves.toStrictEqual({});
  // Config should have updated
  await expect(api.admin.config.get(token)).resolves.toStrictEqual({
    siteName: 'Name changed',
    listedGroups: [],
    version: consts.VERSION,
  });
});

it('Errors if the new config has an incorrect version', async () => {
  await expect(api.admin.config.put(token, {
    siteName: 'Name changed',
    mainPageGroups: [],
    version: consts.VERSION + 'invalid',
  })).rejects.toMatchObject({ code: 400 });
});

it('Errors if the new config has references a non-existent page group', async () => {
  await expect(api.admin.config.put(token, {
    siteName: 'Name changed',
    mainPageGroups: ['invalid'],
    version: consts.VERSION,
  })).rejects.toMatchObject({ code: 400 });
});

it.todo('Can set pages as a main page group');

it('Rejects invalid tokens', async () => {
  await expect(api.admin.config.put('invalid token', {
    siteName: 'Name changed',
    mainPageGroups: [],
    version: consts.VERSION,
  })).rejects.toMatchObject({ code: 401 });
});

it('Errors if site is not set up', async () => {
  await api.debug.clear();
  await expect(api.admin.config.put(token, {
    siteName: 'Name changed',
    mainPageGroups: [],
    version: consts.VERSION,
  })).rejects.toMatchObject({ code: 400 });
});
