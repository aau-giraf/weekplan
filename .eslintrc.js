// https://docs.expo.dev/guides/using-eslint/
module.exports = {
  extends: ["expo", "plugin:testing-library/react"],
  rules: {
    "testing-library/await-async-queries": "error",
    "testing-library/no-await-sync-queries": "error",
    "testing-library/no-debugging-utils": "warn",
    "testing-library/no-dom-import": "off",
    "testing-library/prefer-screen-queries": "error",
    "testing-library/no-unnecessary-act": "error",
    "testing-library/no-wait-for-multiple-assertions": "error",
  },
};
