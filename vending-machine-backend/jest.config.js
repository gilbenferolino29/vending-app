module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  // Look for test files in 'src/**/*.test.ts'
  testMatch: ["<rootDir>/src/**/*.test.ts"],
  // Collect coverage from your source files
  collectCoverageFrom: [
    "src/**/*.ts",
    "!src/**/*.d.ts", // Exclude declaration files
    "!src/**/index.ts", // Exclude main app entry point
    "!src/routes/*.ts", // Exclude routes directly (they are covered by integration tests)
    "!src/middleware/*.ts", // Exclude middleware directly (covered by integration tests)
  ],
  // Specify which directories Jest should ignore when looking for test files
  testPathIgnorePatterns: ["/node_modules/", "/dist/"],
};
