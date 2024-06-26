import { Merge } from "./../../ts-tools/common-ts-tools";
import { Theme } from "react-native-paper/src/types";

export type ThemeExt = Merge<
   Theme,
   {
      dark: boolean;
      roundness: number;
      roundnessSmall: number;
      backgroundImage?: {};
      backgroundImage2?: {};
      backgroundForPictures?: {};
      backgroundForText?: {};
      shadowBottom?: {};

      colors: {
         primary: string;
         primary2: string;
         background: string;
         background2: string;
         backgroundBottomGradient: string;
         specialBackground1: string;
         specialBackground2: string;
         specialBackground3: string;
         specialBackground4: string;
         surface: string;
         accent: string;
         accent2: string;
         accent3: string;
         error: string;
         text: string;
         text2: string;
         textLogin: string;
         logoColor: string;
         logoColor2: string;
         disabled: string;
         placeholder: string;
         backdrop: string;
         statusOk: string;
         statusWarning: string;
         statusBad: string;
         notification: string;
         deviceNotificationLed: string;
      };
      chatNamesColors: string[];
      font: FontExt;
   }
>;

export interface Themed {
   theme: Theme;
}

export interface FontExt {
   semiBold: string;
   regular: string;
   medium: string;
   light: string;
   extraLight: string;
   thin: string;
}
