import { defineConfig } from 'vitest/config';

const sharedTest = {
  globals: true,
  environment: 'node',
  root: './',
  coverage: {
    provider: 'v8',
  },
};

export default defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    projects: [
      {
        test: {
          ...sharedTest,
          name: 'UNIT',
          include: ['**/*.spec.ts'],
        },
      },
      {
        test: {
          ...sharedTest,
          name: 'E2E',
          include: ['**/*.e2e-spec.ts'],
          testTimeout: 60_000,
          hookTimeout: 60_000,
          globalSetup: './test/e2e/global-setup.ts',
        },
      },
      {
        test: {
          ...sharedTest,
          name: 'FEATURE',
          include: ['**/*.feature-spec.ts'],
          setupFiles: ['./vitest.setup.ts'],
        },
      },
    ],
  },
});
