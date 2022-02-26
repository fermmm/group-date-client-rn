import color from "color";
import { montserrat, montserratForPaper } from "./fonts/montserrat";
import { polly, pollyForPaper } from "./fonts/polly";

export default {
   dark: false,
   roundness: 25,
   roundnessSmall: 10,
   colors: {
      primary: "#FFBF9C",
      primary2: "#5EFFF4",
      accent: "#5EFFF4",
      accent2: "#244A7A",
      accent3: "#00E0DD",
      background: "#FFFFFF",
      background2: "#E5E9F0",
      backgroundBottomGradient: "#DFE4EC",
      specialBackground1: "#9B63F8",
      specialBackground2: "#809FFC",
      specialBackground3: "#FFD386",
      surface: "#FFFFFF",
      error: "#FF7A8F",
      text: "#000000",
      text2: "#FFFFFF",
      textLogin: "#ECEFFB",
      logoColor: "#FF84A2",
      logoColor2: "#FF7AB4",
      statusOk: "#00C781",
      statusWarning: "#FFAA15",
      statusBad: "#FF4040",
      disabled: "#FFBF9C",
      placeholder: color("#DCC4CA").alpha(0.54).rgb().string(),
      backdrop: color("#DCC4CA").alpha(0.5).rgb().string(),
      notification: "#FF7A8F",
      deviceNotificationLed: "#5EFFF4"
   },
   chatNamesColors: [
      "#29b516",
      "#a85b7c",
      "#006cff",
      "#379ba8",
      "#f72e62",
      "#f0ff00",
      "#2b8129",
      "#2d2981",
      "#000000",
      "#7778b1",
      "#755c72",
      "#878900",
      "#00bab3",
      "#660000",
      "#ae5bde",
      "#de5b5b",
      "#d95bde",
      "#9600ff",
      "#a2ff00",
      "#0c00ff"
   ],
   font: montserrat,
   fonts: montserratForPaper,
   backgroundImage: require("../../assets/backgroundLight4.png"),
   backgroundImage2: require("../../assets/backgroundLight4_vertical.png"),
   backgroundForPictures: require("../../assets/backgroundSuperLight.png"),
   backgroundForText: require("../../assets/pattern2.png"),
   shadowBottom: require("../../assets/navBarShadow.png"),
   animation: {
      scale: 1.0
   }
};
