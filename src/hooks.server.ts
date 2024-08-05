import { sequence } from '@sveltejs/kit/hooks';
import type { Handle } from '@sveltejs/kit';
import { dev } from '$app/environment';
import { logger } from './middleware/logger';

const middleware: Handle[] = [];

if (dev) {
  middleware.push(logger);
}

export const handle = sequence(...middleware);
