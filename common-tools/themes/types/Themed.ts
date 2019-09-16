import { Theme, Colors } from "react-native-paper/typings";

export interface ThemeExt extends Theme {
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
    fonts: {
        regular: string;
        medium: string;
        light: string;
        thin: string;
    };
}

export interface Themed {
    theme: ThemeExt;
}
