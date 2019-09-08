import color from "color";
import { pinkA400 } from "react-native-paper/src/styles/colors";
import fonts from "react-native-paper/src/styles/fonts";
import montserrat from "./fonts/montserrat";

export default {
  dark: true,
  roundness: 4,
  colors: {
    primary: "#809FFC",
    primary2: "#E2F8FE",
    accent: "#B1EFFB",
    accent2: "#244A7A",
    background: "#9B63F8",
    background2: "#809FFC",
    backgroundForText: "#FFFFFF",
    surface: "#9FA3B2",
    error: "#FF7A8F",
    text: "#000000",
    text2: "#F4E9FB",
    textLogin: "#F4E9FB",
    logoColor: "#9BD6FE",
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
