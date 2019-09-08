import { Platform } from "react-native";

interface Font {
    semiBold: string;
    regular: string;
    medium: string;
    light: string;
    extraLight: string;
    thin: string;
}

const montserrat: Font = Platform.select({
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
