// https://jest-extended.jestcommunity.dev/docs/getting-started/setup#use-with-vitest
import { expect } from 'vitest';
import * as matchers from 'jest-extended';
expect.extend(matchers);
