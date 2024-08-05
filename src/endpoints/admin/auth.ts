/** Authentication endpoints */
import { apiFetch } from '../fetch';

/**
 * Log in as an administrator for the site
 *
 * @param username The username of the admin account
 * @param password The password of the admin account
 */
export const login = async (username: string, password: string) => {
  return apiFetch(
    'POST',
    '/api/admin/auth/login',
    undefined,
    { username, password }
  ) as Promise<{ token: string }>;
};

/**
 * Log out, invalidating the token
 *
 * @param token The token to invalidate
 */
export const logout = async (token: string) => {
  return apiFetch(
    'POST',
    '/api/admin/auth/logout',
    token,
  ) as Promise<{ token: string }>;
};

/**
 * Change the authentication of the admin account
 *
 * @param token The auth token
 * @param oldPassword The currently-active password
 * @param newPassword The new replacement password
 */
export const change = async (token: string, newUsername: string, oldPassword: string, newPassword: string) => {
  return apiFetch(
    'POST',
    '/api/admin/auth/change',
    token,
    { newUsername, oldPassword, newPassword }
  ) as Promise<Record<string, never>>;
};

/**
 * Revoke all current API tokens
 *
 * @param token The auth token
 */
export const revoke = async (token: string) => {
  return apiFetch(
    'POST',
    '/api/admin/auth/revoke',
    token
  ) as Promise<Record<string, never>>;
};

/**
 * Disable authentication, meaning that users can no-longer log into the
 * system.
 *
 * @param token The auth token
 * @param password The password to the admin account
 */
export const disable = async (token: string, password: string) => {
  return apiFetch(
    'POST',
    '/api/admin/auth/disable',
    token,
    { password }
  ) as Promise<Record<string, never>>;
};

const auth = {
  login,
  logout,
  change,
  disable,
  revoke,
};

export default auth;
