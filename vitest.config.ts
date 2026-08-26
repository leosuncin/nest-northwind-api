import swc from 'unplugin-swc';
import { defineConfig } from 'vitest/config';

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const swcPlugin = swc.vite({
  module: { type: 'es6' },
  jsc: {
    parser: {
      syntax: 'typescript',
      decorators: true,
    },
    transform: {
      legacyDecorator: true,
      decoratorMetadata: true,
    },
    target: 'es2022',
    keepClassNames: true,
  },
});

const sharedTest = {
  globals: true,
  environment: 'node',
  coverage: {
    provider: 'v8',
  },
};

export default defineConfig({
  plugins: [swcPlugin],
  test: {
    projects: [
      {
        plugins: [swcPlugin],
        test: {
          ...sharedTest,
          name: 'UNIT',
          include: ['src/**/*.spec.ts'],
        },
      },
      {
        plugins: [swcPlugin],
        test: {
          ...sharedTest,
          name: 'E2E',
          include: ['test/**/*.e2e-spec.ts'],
          testTimeout: 60_000,
          hookTimeout: 60_000,
        },
      },
      {
        plugins: [swcPlugin],
        test: {
          ...sharedTest,
          name: 'Contract',
          include: ['test/**/*.ct-spec.ts'],
        },
      },
    ],
  },
});
