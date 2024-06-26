/**
 * load.test.ts
 *
 * Tests to ensure that pages can be loaded without issue.
 */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck -- I'll fix the errors at some point I just wanna get it working
import request from 'sync-request-curl';
import { getProjectSlugs } from '$lib/server/project';
import { getLanguageSlugs } from '$lib/server/language';
import { reloadData } from '$lib/server';

const BASE_URL = 'http://localhost:5173';

function checkPageForError(path: string) {
  const res = request('GET', `${BASE_URL}${path}`);

  if (res.statusCode >= 400) {
    throw new Error(`GET ${path} got unexpected status ${res.statusCode}`);
  }
}

// Load data before running tests
reloadData();

// Main page

test('load main page', () => {
  expect(checkPageForError('/')).toBeUndefined();
});

test('load languages page', () => {
  expect(checkPageForError('/languages')).toBeUndefined();
});

// Generated pages

describe('load project pages', () => {
  test.each(
    getProjectSlugs()
  )('load project page %s', (slug: string) => {
    expect(checkPageForError(`/projects/${slug}`)).toBeUndefined();
  });
});

describe('load language pages', () => {
  test.each(
    getLanguageSlugs()
  )('load language page %s', (slug: string) => {
    expect(checkPageForError(`/languages/${slug}`)).toBeUndefined();
  });
});
