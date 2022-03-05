import * as Font from "expo-font";

export async function loadFontPolly(): Promise<void> {
   return Font.loadAsync({
      "PollyRounded-Thin": require("../../assets/fonts/Polly/PollyRounded-Thin.otf"),
      "PollyRounded-ExtraLight": require("../../assets/fonts/Polly/PollyRounded-Light.otf"), // This font does not have extra light version
      "PollyRounded-Light": require("../../assets/fonts/Polly/PollyRounded-Light.otf"),
      "PollyRounded-Regular": require("../../assets/fonts/Polly/PollyRounded-Regular.otf"),
      "PollyRounded-Medium": require("../../assets/fonts/Polly/PollyRounded-Regular.otf"), // This font does not have medium
      "PollyRounded-SemiBold": require("../../assets/fonts/Polly/PollyRounded-Bold.otf") // This font does not have semi bold version
   });
}
