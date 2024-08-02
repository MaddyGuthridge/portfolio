import { mergeConfig, defineConfig } from 'vitest/config'
import defaultConfig from './vite.config';

export default mergeConfig(defaultConfig, defineConfig({
  test: {
    // globals: true,
    setupFiles: [
      'tests/setup/serverBeforeEach.ts',
    ],
    fileParallelism: false,
    globalSetup: ['tests/setup/globalSetup.ts']
  },
}));