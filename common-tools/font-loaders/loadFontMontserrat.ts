import * as Font from "expo-font";

export async function loadFontMontserrat(): Promise<void> {
    return Font.loadAsync({
        "Montserrat-Thin": require("../../assets/fonts/Montserrat/Montserrat-Thin.ttf"),
        "Montserrat-ExtraLight": require("../../assets/fonts/Montserrat/Montserrat-ExtraLight.ttf"),
        "Montserrat-Light": require("../../assets/fonts/Montserrat/Montserrat-Light.ttf"),
        "Montserrat-Regular": require("../../assets/fonts/Montserrat/Montserrat-Regular.ttf"),
        "Montserrat-Medium": require("../../assets/fonts/Montserrat/Montserrat-Medium.ttf"),
        "Montserrat-SemiBold": require("../../assets/fonts/Montserrat/Montserrat-SemiBold.ttf"),
    });
}
