/**
 * Git repo constants
 *
 * This file contains constants used to determine which git repos are used by
 * the test suite.
 *
 * Ideally, they should be repos that the CI has access to, so that it can
 * clone, and potentially pull and push it.
 *
 * See the instructions in `.github/workflows/secrets/README.md`
 */

/** Test repository containing sample portfolio data. Full read/write access */
export const TEST_REPO_RW = 'git@github.com:MadGutsBot/Portfolio-Test-Repo.git';

/** Repository that doesn't contain portfolio data. Read-only access */
export const NON_PORTFOLIO_REPO = 'https://github.com/MadGutsBot/MadGutsBot.github.io.git';

/** Empty repository. Read-only access */
export const EMPTY_REPO = 'https://github.com/MadGutsBot/Empty.git';

/** Repository that does not exist */
export const INVALID_REPO = 'https://github.com/MadGutsBot/Invalid-Repo.git';

export default {
  TEST_REPO_RW,
  NON_PORTFOLIO: NON_PORTFOLIO_REPO,
  INVALID: INVALID_REPO,
  EMPTY: EMPTY_REPO,
};
