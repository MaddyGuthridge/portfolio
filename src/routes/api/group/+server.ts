import { error, json } from '@sveltejs/kit';
import { dataDirIsInit } from '$lib/server/data/dataDir';
import { getGroupInfoBrief, listGroups, type GroupInfoBrief } from '$lib/server/data/group';

export async function GET({ request, cookies }) {
  if (!await dataDirIsInit()) {
    return error(400, 'Server is not initialized');
  }

  return json(
    Object.fromEntries(
      await Promise.all(
        (await listGroups())
          .map(async g => [g, await getGroupInfoBrief(g)] as [string, GroupInfoBrief])
      )
    ),
    { status: 200 },
  );
}
