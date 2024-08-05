import { dev } from '$app/environment';
import { getDataDir } from '$lib/server/data/dataDir.js';
import { error, json } from '@sveltejs/kit';
import { rimraf } from 'rimraf';

export async function DELETE({ request, cookies }) {
  if (!dev) throw error(404);
  // Delete data directory
  await rimraf(getDataDir());

  return json({}, { status: 200 });
}
