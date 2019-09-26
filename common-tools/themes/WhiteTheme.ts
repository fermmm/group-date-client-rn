import color from "color";
import montserrat from "./fonts/montserrat";

export default {
  dark: false,
  roundness: 25,
  colors: {
    primary: "#9FADD9",
    primary2: "#E2F8FE",
    accent: "#B1EFFB",
    accent2: "#244A7A",
    background: "#9B63F8",
    background2: "#809FFC",
    backgroundForText: "#FFFFFF",
    surface: "#FFFFFF",
    topBar: "#B2B2B2",
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
    notification: "#FF7A8F",
  },
  fonts: montserrat,
  backgroundImage: require("../../assets/backgroundLight3.png"),
  animation: {
    scale: 1.0,
  },
};
