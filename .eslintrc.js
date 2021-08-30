module.exports = {
  env: {
    "node": true
  },
  extends: ["eslint:recommended", "plugin:import/errors", "plugin:import/warnings"],
  parser: "babel-eslint",
  globals: {
    process: true,
    window: true,
    Promise: true,
    Set: true,
    document: true
  },
  plugins: [
    "import"
  ],
  rules: {
    "indent": ["error", 2],
    "no-console": ["off"],
    "no-debugger": ["off"],
    "import/no-unresolved": ["off"],
    "comma-dangle": ["off"],
    "react/no-find-dom-node": ["off"],
    'no-undef': ["warn"],
    'no-unused-vars': ["warn"],
    'no-empty': ['off'],
    "complexity": ["error", 30],
    "max-depth": ["error", 4],
    "max-nested-callbacks": ["error", 3],
    "no-useless-escape": [0],
    "import/no-extraneous-dependencies": ["error", {"devDependencies": false, "optionalDependencies": false, "peerDependencies": false}]

  }
};