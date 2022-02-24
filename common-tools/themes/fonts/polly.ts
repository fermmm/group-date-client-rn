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

const pollyForPaper: FontExt = configureFonts({
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
   }
}) as unknown as FontExt;

export { polly, pollyForPaper };
