import { Merge } from "./../../ts-tools/common-ts-tools";
import { Theme, Colors } from "react-native-paper";

export type ThemeExt = Merge<Theme, {
    dark: boolean;
    roundness: number;
    backgroundImage?: {};

    colors: {
        primary: string;
        primary2: string;
        background: string;
        background2: string;
        backgroundForText: string;
        surface: string;
        topBar: string;
        accent: string;
        accent2: string;
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
}>;

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
