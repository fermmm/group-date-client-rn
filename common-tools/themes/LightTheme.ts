import color from "color";
import { montserrat, montserratForPaper } from "./fonts/montserrat";

export default {
   dark: false,
   roundness: 4,
   colors: {
      primary: "#D08686",
      primary2: "#D08686",
      accent: "#F9F5F6",
      accent2: "#fe4e4e",
      accent3: "#835A74",
      background: "#363E44",
      backgroundBottomGradient: "#FF8115",
      specialBackground1: "#634865",
      specialBackground2: "#363E44",
      surface: "#363E44",
      error: "#FF7A8F",
      text: "#F6EFF1",
      text2: "#C7BBC9",
      textLogin: "#F4E9FB",
      logoColor: "#fe4e4e",
      statusOk: "#00C781",
      statusWarning: "#FFAA15",
      statusBad: "#FF4040",
      disabled: color("#DCC4CA").alpha(0.26).rgb().string(),
      placeholder: color("#DCC4CA").alpha(0.54).rgb().string(),
      backdrop: color("#DCC4CA").alpha(0.5).rgb().string(),
      notification: "#FF4040"
   },
   font: montserrat,
   fonts: montserratForPaper,
   backgroundImage: require("../../assets/backgroundLight3.png"),
   backgroundImage2: require("../../assets/backgroundLight4_vertical.png"),
   animation: {
      scale: 1.0
   }
};
