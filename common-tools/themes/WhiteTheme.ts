import color from "color";
import montserrat from "./fonts/montserrat";

export default {
   dark: false,
   roundness: 25,
   colors: {
      primary: "#FFBF9C",
      primary2: "#5EFFF4",
      accent: "#5EFFF4",
      accent2: "#244A7A",
      accent3: "#00E0DD",
      background: "#FFFFFF",
      backgroundBottomGradient: "#DFE4EC",
      specialBackground1: "#9B63F8",
      specialBackground2: "#809FFC",
      surface: "#FFFFFF",
      error: "#FF7A8F",
      text: "#000000",
      text2: "#FFFFFF",
      textLogin: "#ECEFFB",
      logoColor: "#FF84A2",
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
   backgroundImage: require("../../assets/backgroundLight4.png"),
   backgroundImage2: require("../../assets/backgroundLight4_vertical.png"),
   backgroundForPictures: require("../../assets/backgroundLight3.png"),
   backgroundForText: require("../../assets/backgroundLight3.png"),
   shadowBottom: require("../../assets/navBarShadow.png"),
   animation: {
      scale: 1.0,
   },
};
