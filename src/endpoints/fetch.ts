import dotenv from 'dotenv';
import ApiError from './ApiError';
import fetch from 'cross-fetch';

export type HttpVerb = 'GET' | 'POST' | 'PUT' | 'DELETE';

dotenv.config();

export const PORT = process.env.PORT as string;
export const HOST = process.env.HOST as string;
export const URL = `http://${HOST}:${PORT}`;

/**
 * Fetch some data from the backend
 *
 * @param method Type of request
 * @param route route to request to
 * @param token auth token
 * @param bodyParams request body or params
 *
 * @returns promise of the resolved data.
 */
export async function apiFetch (
  method: HttpVerb,
  route: string,
  token?: string,
  bodyParams?: object
): Promise<object> {
  if (bodyParams === undefined) {
    bodyParams = {};
  }

  const headers = new Headers(
    token !== undefined
      ? { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
      : { 'Content-Type': 'application/json' }
  );

  let url: string;
  let body: string | null; // JSON string

  if (['POST', 'PUT'].includes(method)) {
    // POST and PUT use a body
    url = `${URL}${route}`;
    body = JSON.stringify(bodyParams);
  } else {
    // GET and DELETE use params
    url
      = `${URL}${route}?`
      + new URLSearchParams(bodyParams as Record<string, string>);
    body = null;
  }

  // Now send the request
  let res: Response;
  try {
    res = await fetch(url, {
      method,
      body,
      headers,
    });
  } catch (err) {
    // Likely a network issue
    if (err instanceof Error) {
      throw new ApiError(null, err.message);
    } else {
      throw new ApiError(null, `Unknown request error ${err}`);
    }
  }

  if ([404, 405].includes(res.status)) {
    throw new ApiError(404, `Error ${res.status} at ${method} ${route}`);
  }

  // Decode the error
  let json: object;
  try {
    json = await res.json();
  } catch (err) {
    // JSON parse error
    if (err instanceof Error) {
      throw new ApiError(null, err.message);
    } else {
      throw new ApiError(null, `Unknown JSON error ${err}`);
    }
  }

  if ([400, 401, 403].includes(res.status)) {
    // All 400 and 403 errors have an error message
    const message = (json as { message: string }).message;
    throw new ApiError(res.status, message);
  }
  if (![200, 304].includes(res.status)) {
    // Unknown error
    throw new ApiError(res.status, `Request got status code ${res.status}`);
  }

  // Got valid data
  // Assign it to a new object, because otherwise it'll fail to match using
  // `.toStrictEqual`, likely due to some weirdness with Jest
  // Seems to be similar to the issues described at these URLs
  // https://github.com/jestjs/jest/issues/8446
  // https://github.com/nktnet1/jewire?tab=readme-ov-file#53-rewire-and-jest
  return Object.assign({}, json);
}
