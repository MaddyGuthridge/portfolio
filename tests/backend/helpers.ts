import api from '$endpoints';
import type { GroupInfoFull } from '$lib/server/data/group';

/** Set up the server */
export async function setup() {
  return (await api.admin.firstrun(null, null)).credentials;
}

/** Create a group with the given ID */
export async function makeGroup(token: string, id: string) {
  await api.group.withId(id).create(token, id, id);
}

/** Creates custom group properties object */
export function createCustomGroupProperties(options: Partial<GroupInfoFull> = {}): GroupInfoFull {
  const group: GroupInfoFull = {
    name: 'My group',
    description: 'Group description',
    color: '#aa00aa',
    filterGroups: [],
    associations: [],
    listedItems: [],
  };

  return { ...group, ...options };
}
