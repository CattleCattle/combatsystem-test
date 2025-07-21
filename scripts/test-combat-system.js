#!/usr/bin/env node

/**
 * Comprehensive Test Runner for Combat System
 * 
 * This script runs all tests for the combat system and provides
 * detailed reporting on the health of the combat mechanics.
 */

const { execSync } = require('child_process');
const path = require('path');

console.log('🔧 Combat System Test Suite');
console.log('============================\n');

const runCommand = (command, description) => {
  console.log(`📋 ${description}...`);
  try {
    const output = execSync(command, { 
      cwd: process.cwd(),
      encoding: 'utf8',
      stdio: 'pipe'
    });
    console.log('✅ Passed\n');
    return { success: true, output };
  } catch (error) {
    console.log('❌ Failed');
    console.log(`Error: ${error.message}\n`);
    return { success: false, error: error.message };
  }
};

const testSuites = [
  {
    command: 'npm test -- --testPathPattern=useBattleQueue --verbose',
    description: 'Testing Battle Queue Hook'
  },
  {
    command: 'npm test -- --testPathPattern=BattleScreen --verbose', 
    description: 'Testing Battle Screen Component'
  },
  {
    command: 'npm test -- --testPathPattern=combatSystem --verbose',
    description: 'Testing Combat System Integration'
  },
  {
    command: 'npm test -- --coverage --watchAll=false',
    description: 'Running Full Test Suite with Coverage'
  }
];

const results = [];

for (const suite of testSuites) {
  const result = runCommand(suite.command, suite.description);
  results.push({
    ...suite,
    ...result
  });
}

// Summary
console.log('📊 Test Results Summary');
console.log('=======================');

const passed = results.filter(r => r.success).length;
const total = results.length;

console.log(`Total Test Suites: ${total}`);
console.log(`Passed: ${passed}`);
console.log(`Failed: ${total - passed}`);

if (passed === total) {
  console.log('\n🎉 All tests passed! Combat system is working correctly.');
} else {
  console.log('\n⚠️  Some tests failed. Please review the errors above.');
  process.exit(1);
}

// Performance recommendations
console.log('\n🚀 Performance Recommendations:');
console.log('- Ensure action bar progression is smooth (60fps)');
console.log('- Combat animations should not exceed 1.5s');
console.log('- Queue updates should be debounced');
console.log('- Memory usage should remain stable during long battles');

// Testing best practices
console.log('\n📝 Testing Best Practices:');
console.log('- Run tests before each commit');
console.log('- Add new tests when implementing features');
console.log('- Maintain >80% code coverage');
console.log('- Test edge cases (dead players, empty queues)');
console.log('- Verify accessibility in UI components');
