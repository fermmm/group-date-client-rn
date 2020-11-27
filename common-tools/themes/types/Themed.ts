import { Merge } from "./../../ts-tools/common-ts-tools";
import { Theme } from "react-native-paper/src/types";

export type ThemeExt = Merge<
   Theme,
   {
      dark: boolean;
      roundness: number;
      backgroundImage?: {};
      backgroundImage2?: {};
      backgroundForPictures?: {};
      backgroundForText?: {};
      shadowBottom?: {};

      colors: {
         primary: string;
         primary2: string;
         background: string;
         backgroundBottomGradient: string;
         specialBackground1: string;
         specialBackground2: string;
         surface: string;
         accent: string;
         accent2: string;
         accent3: string;
         error: string;
         text: string;
         text2: string;
         textLogin: string;
         logoColor: string;
         disabled: string;
         placeholder: string;
         backdrop: string;
         statusOk: string;
         statusWarning: string;
         statusBad: string;
      };
      fonts: FontExt;
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
