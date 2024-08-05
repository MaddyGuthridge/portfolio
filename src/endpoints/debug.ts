/** Debug endpoints */
import { apiFetch } from './fetch';

/**
 * Reset the app to its default state.
 */
export const clear = async () => {
  return apiFetch(
    'DELETE',
    '/api/debug/clear',
    undefined,
  ) as Promise<Record<string, never>>;
};

/**
 * Echo text to the server's console
 */
export const echo = async (text: string) => {
  return apiFetch(
    'POST',
    '/api/debug/echo',
    undefined,
    { text }
  ) as Promise<Record<string, never>>;
};

const debug = {
  clear,
  echo,
};

export default debug;
