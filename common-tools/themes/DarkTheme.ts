import color from "color";
import LightTheme from "./LightTheme";
import {
  black,
  grey800,
  redA400,
  pinkA100,
} from "react-native-paper/src/styles/colors";
import { Theme } from "react-native-paper/types";

const DarkTheme: Theme = {
  ...LightTheme,
  dark: true,
  colors: {
    ...LightTheme.colors,
    background: "#242424",
    surface: grey800,
    error: redA400,
    disabled: color(LightTheme.colors.text)
      .alpha(0.3)
      .rgb()
      .string(),
    placeholder: color(LightTheme.colors.text)
      .alpha(0.54)
      .rgb()
      .string(),
    backdrop: color(black)
      .alpha(0.5)
      .rgb()
      .string(),
    notification: pinkA100,
  },
};

export default DarkTheme;
