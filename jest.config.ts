import { readFileSync } from 'node:fs';

import type { Config } from 'jest';
import { pathsToModuleNameMapper } from 'ts-jest';
import type { CompilerOptions } from 'typescript';

const { compilerOptions } = JSON.parse(
  readFileSync('./tsconfig.json', { encoding: 'utf8' }),
) as { compilerOptions: CompilerOptions };

export default {
  projects: [
    {
      displayName: 'DEFAULT',
      moduleDirectories: ['node_modules', process.cwd()],
      moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths ?? {}),
      preset: 'ts-jest',
      rootDir: 'src',
      testEnvironment: 'node',
      testRegex: '\\.spec\\.ts$',
    },
    {
      displayName: 'E2E',
      moduleDirectories: ['node_modules', process.cwd()],
      moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths ?? {}),
      preset: 'ts-jest',
      transform: {
        '^.+\\.tsx?$': [
          'ts-jest',
          {
            useESM: true,
            tsconfig: {
              module: 'ESNext',
              moduleResolution: 'Bundler',
            },
          },
        ],
      },
      extensionsToTreatAsEsm: ['.ts'],
      testTimeout: 30_000,
      rootDir: 'test',
      testEnvironment: 'node',
      testRegex: '\\.e2e-spec\\.ts$',
    },
  ],
} satisfies Config;
