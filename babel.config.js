module.exports = function (api) {
   api.cache(true);
   return {
      presets: ["babel-preset-expo"],
      plugins: [
         "inline-dotenv",
         "react-native-reanimated/plugin",
         [
            "babel-plugin-inline-import",
            {
               extensions: [".svg"]
            }
         ]
      ]
   };
};
