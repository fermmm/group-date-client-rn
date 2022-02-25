import { Platform } from "react-native";
import { configureFonts } from "react-native-paper";
import { FontExt } from "../types/Themed";

const montserrat: FontExt = Platform.select({
   web: {
      semiBold: "Montserrat-SemiBold",
      regular: "Montserrat-Regular",
      medium: "Montserrat-Medium",
      light: "Montserrat-Light",
      extraLight: "Montserrat-ExtraLight",
      thin: "Montserrat-Thin"
   },
   ios: {
      semiBold: "Montserrat-SemiBold",
      regular: "Montserrat-Regular",
      medium: "Montserrat-Medium",
      light: "Montserrat-Light",
      extraLight: "Montserrat-ExtraLight",
      thin: "Montserrat-Thin"
   },
   default: {
      semiBold: "Montserrat-SemiBold",
      regular: "Montserrat-Regular",
      medium: "Montserrat-Medium",
      light: "Montserrat-Light",
      extraLight: "Montserrat-ExtraLight",
      thin: "Montserrat-Thin"
   }
});

const paperFonts = {
   default: {
      regular: {
         fontFamily: "Montserrat-Regular"
      },
      medium: {
         fontFamily: "Montserrat-Medium"
      },
      light: {
         fontFamily: "Montserrat-Light"
      },
      thin: {
         fontFamily: "Montserrat-Thin"
      }
   },
   ios: null,
   android: null
};

paperFonts.ios = paperFonts.ios ?? paperFonts.default;
paperFonts.android = paperFonts.android ?? paperFonts.default;

const montserratForPaper: FontExt = configureFonts(paperFonts) as unknown as FontExt;

export { montserrat, montserratForPaper };
