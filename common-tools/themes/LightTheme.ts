import color from "color";
import { pinkA400 } from "react-native-paper/src/styles/colors";
import fonts from "react-native-paper/src/styles/fonts";
import montserrat from "./fonts/montserrat";

export default {
  dark: false,
  roundness: 4,
  colors: {
    primary: "#D08686",
    primary2: "#D08686",
    accent: "#F9F5F6",
    accent2: "#fe4e4e",
    background: "#634865",
    background2: "#363E44",
    backgroundForText: "#363E44",
    surface: "#363E44",
    topBar: "#835A74",
    error: "#FF7A8F",
    text: "#F6EFF1",
    text2: "#C7BBC9",
    logoColor: "#fe4e4e",
    statusOk: "#00C781",
    statusWarning: "#FFAA15",
    statusBad: "#FF4040",
    disabled: color("#DCC4CA")
      .alpha(0.26)
      .rgb()
      .string(),
    placeholder: color("#DCC4CA")
      .alpha(0.54)
      .rgb()
      .string(),
    backdrop: color("#DCC4CA")
      .alpha(0.5)
      .rgb()
      .string(),
    notification: pinkA400,
  },
  fonts: montserrat,
  backgroundImage: require("../../assets/backgroundLight3.png"),
  animation: {
    scale: 1.0,
  },
};
