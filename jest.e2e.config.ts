export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/tests/e2e'],
  setupFilesAfterEnv: ['<rootDir>/tests/e2e/setup.ts'],
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      isolatedModules: true
    }]
  },
  testPathIgnorePatterns: ['/node_modules/']
}; 