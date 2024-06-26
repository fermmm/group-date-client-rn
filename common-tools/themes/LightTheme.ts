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
      background2: "#ECEFF4",
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
      notification: "#FF4040",
      deviceNotificationLed: "#5EFFF4"
   },
   chatNamesColors: [
      "#a85b7c",
      "#379ba8",
      "#f72e62",
      "#2b8129",
      "#2d2981",
      "#000000",
      "#7778b1",
      "#755c72",
      "#29b516",
      "#878900",
      "#00bab3",
      "#660000",
      "#ae5bde",
      "#de5b5b",
      "#d95bde",
      "#9600ff",
      "#006cff",
      "#a2ff00",
      "#0c00ff",
      "#f0ff00"
   ],
   font: montserrat,
   fonts: montserratForPaper,
   backgroundImage: require("../../assets/backgroundLight3.png"),
   backgroundImage2: require("../../assets/backgroundLight4_vertical.png"),
   animation: {
      scale: 1.0
   }
};
