import color from "color";
import montserrat from "./fonts/montserrat";

export default {
  dark: true,
  roundness: 4,
  colors: {
    primary: "#9BD6FE",
    primary2: "#9BD6FE",
    accent: "#E6FBFF",
    accent2: "#244A7A",
    background: "#9B63F8",
    background2: "#809FFC",
    backgroundForText: "#3F5169",
    surface: "#3F5169",
    topBar: "#1A3557",
    error: "#FF7A8F",
    text: "#F4E9FB",
    text2: "#11243B",
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
    notification: "#FF4040",
  },
  fonts: montserrat,
  backgroundImage: require("../../assets/backgroundLight.png"),
  animation: {
    scale: 1.0,
  },
};
