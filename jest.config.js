module.exports = {
  moduleFileExtensions: ['js', 'json', 'vue'],
  transform: {
    '^.+\\.js$': 'babel-jest',
    '^.+\\.vue$': '@vue/vue3-jest',
  },
  setupFilesAfterEnv: ['./jest.setup.js'],
  testEnvironment: 'jsdom',

  // You either need to enable Jest to use babel to compile node modules for v-query, or you need to transpile/dist v-query before running the tests
  // https://jestjs.io/docs/configuration#transformignorepatterns-arraystring
  transformIgnorePatterns: ['!@jetstreamkit/v-query'],
}
