module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      //THIS PACKAGE MUST BE LAST FOR SOME REASON
      "react-native-reanimated/plugin",
    ],
  };
};
