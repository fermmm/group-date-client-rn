import { Platform } from "react-native";
import { configureFonts } from "react-native-paper";
import { FontExt } from "../types/Themed";

const polly: FontExt = Platform.select({
   web: {
      semiBold: "PollyRounded-SemiBold",
      regular: "PollyRounded-Regular",
      medium: "PollyRounded-Medium",
      light: "PollyRounded-Light",
      extraLight: "PollyRounded-ExtraLight",
      thin: "PollyRounded-Thin"
   },
   ios: {
      semiBold: "PollyRounded-SemiBold",
      regular: "PollyRounded-Regular",
      medium: "PollyRounded-Medium",
      light: "PollyRounded-Light",
      extraLight: "PollyRounded-ExtraLight",
      thin: "PollyRounded-Thin"
   },
   default: {
      semiBold: "PollyRounded-SemiBold",
      regular: "PollyRounded-Regular",
      medium: "PollyRounded-Medium",
      light: "PollyRounded-Light",
      extraLight: "PollyRounded-ExtraLight",
      thin: "PollyRounded-Thin"
   }
});

const paperFonts = {
   default: {
      regular: {
         fontFamily: "PollyRounded-Regular"
      },
      medium: {
         fontFamily: "PollyRounded-Medium"
      },
      light: {
         fontFamily: "PollyRounded-Light"
      },
      thin: {
         fontFamily: "PollyRounded-Thin"
      }
   },
   ios: null,
   android: null
};

paperFonts.ios = paperFonts.ios ?? paperFonts.default;
paperFonts.android = paperFonts.android ?? paperFonts.default;

const pollyForPaper: FontExt = configureFonts(paperFonts) as unknown as FontExt;

export { polly, pollyForPaper };
