module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  moduleNameMapper: {
    "^@this/(.*)$": "<rootDir>/src/main/$1",
  },
};
