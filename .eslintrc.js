module.exports = {
  root: true,
  parserOptions: {
    parser: "babel-eslint",
    sourceType: "module"
  },
  env: {
    browser: true,
    node: true,
    es6: true
  },
  plugins: ["vue", "prettier"],
  extends: ["eslint-config-ali/essential/vue", "eslint:recommended"],
  rules: {
    "prettier/prettier": "error",
    "no-unused-vars": 0,
    "no-console": "off"
  },
  globals: {
    google: true
  }
};
