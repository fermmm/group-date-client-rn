import color from "color";
import { pinkA400 } from "react-native-paper/src/styles/colors";
import fonts from "react-native-paper/src/styles/fonts";

export default {
  dark: false,
  roundness: 4,
  colors: {
    primary: "#C56A6A",
    accent: "#CD7E83",
    background: "#634865",
    surface: "#835A74",
    error: "#FF7A8F",
    text: "#DCC4CA",
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
  fonts,
  animation: {
    scale: 1.0,
  },
};
