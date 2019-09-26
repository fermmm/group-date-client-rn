import { Platform } from "react-native";
import { FontExt } from "../types/Themed";

const montserrat: FontExt = Platform.select({
    web: {
        semiBold: "Montserrat-SemiBold",
        regular: "Montserrat-Regular",
        medium: "Montserrat-Medium",
        light: "Montserrat-Light",
        extraLight: "Montserrat-ExtraLight",
        thin: "Montserrat-Thin",
    },
    ios: {
        semiBold: "Montserrat-SemiBold",
        regular: "Montserrat-Regular",
        medium: "Montserrat-Medium",
        light: "Montserrat-Light",
        extraLight: "Montserrat-ExtraLight",
        thin: "Montserrat-Thin",
    },
    default: {
        semiBold: "Montserrat-SemiBold",
        regular: "Montserrat-Regular",
        medium: "Montserrat-Medium",
        light: "Montserrat-Light",
        extraLight: "Montserrat-ExtraLight",
        thin: "Montserrat-Thin",
    },
});

export default montserrat;
