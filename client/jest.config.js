// /** @type {import('ts-jest').JestConfigWithTsJest} */
// module.exports = {
//   preset: "ts-jest",
//   moduleNameMapper: {
//     "\\.(css|less|sass|scss)$": "identity-obj-proxy",
//   },
//   testEnvironment: "jsdom",
//   transform: {
//     "^.+\\.(ts|tsx)?$": "ts-jest",
//   },
//   setupFilesAfterEnv: ["<rootDir>/src/setupTests.ts"],
// };

module.exports = {
  preset: "ts-jest",
  moduleNameMapper: {
    "\\.(css|less|sass|scss)$": "identity-obj-proxy",
  },
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.(ts|tsx)?$": "ts-jest",
    "^.+\\.jsx?$": "babel-jest", // Add this line to handle JavaScript files with Babel
  },
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.ts"],
};
