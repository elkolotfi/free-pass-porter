import { runCLI } from '@jest/core';
import type { Config } from '@jest/types';
import existingConfig from '../jest.config.cjs';
const coverageThreshold = process.env.COVERAGE_THRESHOLD || '80';

// Ensure the coverage threshold is a valid number
const threshold = parseInt(coverageThreshold, 10);
if (isNaN(threshold) || threshold < 0 || threshold > 100) {
  console.error('Invalid COVERAGE_THRESHOLD. Please provide a number between 0 and 100.');
  process.exit(1);
}

// Merge the existing config with our coverage threshold
const jestConfig: Config.InitialOptions = {
  ...existingConfig,
  coverageThreshold: {
    global: {
      branches: threshold,
      functions: threshold,
      lines: threshold,
      statements: threshold,
    },
  },
};

runCLI(
  { 
    config: JSON.stringify(jestConfig),
    coverage: true,
  } as Config.Argv, 
  [process.cwd()]
)
  .then((results) => {
    if (results.results.success) {
      console.log('All tests passed and coverage thresholds met!');
      process.exit(0);
    } else {
      console.error('Tests failed or coverage thresholds not met.');
      process.exit(1);
    }
  })
  .catch((error) => {
    console.error('An error occurred while running tests:', error);
    process.exit(1);
  });