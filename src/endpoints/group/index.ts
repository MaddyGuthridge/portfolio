/** Group management endpoints */
import type { GroupInfoBrief, GroupInfoFull } from '$lib/server/data/group';
import { apiFetch } from '../fetch';

/**
 * Return a list of groups
 *
 * @returns list of groups
 */
export const list = async () => {
  return apiFetch(
    'GET',
    '/api/group',
    undefined,
  ) as Promise<Record<string, GroupInfoBrief>>;
};

/** Access a group with the given ID */
export const withId = (groupId: string) => {
  /**
   * Create a new group
   *
   * @param token The authentication token
   * @param name The name of the group
   */
  const create = async (token: string, name: string, description: string) => {
    return apiFetch(
      'POST',
      `/api/group/${groupId}`,
      token,
      { name, description },
    ) as Promise<Record<string, never>>;
  };

  /**
   * Return info on a particular group
   *
   * @returns info about the group
   */
  const getInfo = async () => {
    return apiFetch(
      'GET',
      `/api/group/${groupId}`,
      undefined,
    ) as Promise<GroupInfoFull>;
  };

  /**
   * Update info on a particular group
   *
   * @param info info about the group
   */
  const setInfo = async (token: string, newInfo: GroupInfoFull) => {
    return apiFetch(
      'PUT',
      `/api/group/${groupId}`,
      token,
      newInfo,
    ) as Promise<Record<string, never>>;
  };

  /**
   * Returns the README.md of the given group
   *
   * @returns readme.md of group
   */
  const getReadme = async () => {
    return apiFetch(
      'GET',
      `/api/group/${groupId}/readme`,
      undefined,
    ) as Promise<{ readme: string }>;
  };

  /**
   * Updates the README.md of the given group
   *
   * @param token Auth token
   * @param readme README.md contents
   */
  const setReadme = async (token: string, readme: string) => {
    return apiFetch(
      'PUT',
      `/api/group/${groupId}/readme`,
      token,
      { readme },
    ) as Promise<Record<string, never>>;
  };

  return {
    create,
    info: {
      get: getInfo,
      set: setInfo,
    },
    readme: {
      get: getReadme,
      set: setReadme,
    },
  };
};

const group = {
  list,
  withId,
};

export default group;
