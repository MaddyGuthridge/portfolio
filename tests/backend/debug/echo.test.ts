/** Test cases for POST /api/debug/echo */
import { it, expect } from 'vitest';
import api from '$endpoints';

it('echoes the value', async () => {
  await expect(api.debug.echo('Hello world!'))
    .resolves.toStrictEqual({ text: 'Hello world!' });
});
