module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  moduleNameMapper: {
    "@functions/(.*)": "<rootDir>/functions/$1",
    "@libs/(.*)": "<rootDir>/libs/$1",
    "@common/(.*)": "<rootDir>/common/$1",
  },
  rootDir: './src'
};
