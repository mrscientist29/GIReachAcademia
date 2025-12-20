#!/usr/bin/env node

/**
 * Simple TestSprite Runner for GI REACH
 * Usage: node run-tests.js [test-type]
 */

const { execSync } = require('child_process');
const chalk = require('chalk');

console.log(chalk.blue.bold('🧪 TestSprite - GI REACH Test Runner'));
console.log(chalk.gray('=' .repeat(50)));

const testCommands = {
  all: 'npm run test:run',
  unit: 'npm run test:run client/src/test/webinar-store.test.ts client/src/test/color-extractor.test.ts server/test/db-mock.test.ts',
  api: 'npm run test:run server/test/api.test.ts',
  components: 'npm run test:run client/src/test/App.test.tsx',
  coverage: 'npm run test:coverage',
  watch: 'npm run test:watch',
  ui: 'npm run test:ui'
};

const testType = process.argv[2] || 'all';

if (!testCommands[testType]) {
  console.log(chalk.red('❌ Unknown test type:'), testType);
  console.log(chalk.yellow('Available options:'));
  Object.keys(testCommands).forEach(key => {
    console.log(`  ${chalk.cyan(key)}: ${testCommands[key]}`);
  });
  process.exit(1);
}

console.log(chalk.yellow(`🚀 Running ${testType} tests...`));
console.log(chalk.gray(`Command: ${testCommands[testType]}\n`));

try {
  execSync(testCommands[testType], { stdio: 'inherit' });
  console.log(chalk.green('\n✅ Tests completed successfully!'));
} catch (error) {
  console.log(chalk.red('\n❌ Tests failed. See output above for details.'));
  console.log(chalk.yellow('\n📋 Quick fixes:'));
  console.log('1. Check import/export statements in test files');
  console.log('2. Ensure all mocked components are properly configured');
  console.log('3. Verify test setup files are correctly referenced');
  console.log(chalk.blue('\n📖 See TEST-RESULTS.md for detailed analysis'));
  process.exit(1);
}