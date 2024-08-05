/** Configuration endpoints */
import { apiFetch } from '../fetch';
import type { PortfolioConfig } from '$types';

/**
 * Retrieve the site configuration.
 *
 * @param token The authentication token
 */
export const get = async (token: string) => {
  return apiFetch(
    'GET',
    '/api/admin/config',
    token,
  ) as Promise<PortfolioConfig>;
};

/**
 * Update the site configuration.
 *
 * @param token The authentication token
 * @param config The updated configuration
 */
export const put = async (token: string, config: PortfolioConfig) => {
  return apiFetch(
    'PUT',
    '/api/admin/config',
    token,
    config,
  ) as Promise<Record<string, never>>;
};

const config = {
  get,
  put,
};

export default config;
