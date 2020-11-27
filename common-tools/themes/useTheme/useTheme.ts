import { useTheme as paperUseTheme } from "react-native-paper";
import { DeepPartial } from "ts-essentials";
import { ThemeExt } from "../types/Themed";

export function useTheme(overrides?: DeepPartial<ReactNativePaper.Theme>): ThemeExt {
   return (paperUseTheme(overrides) as unknown) as ThemeExt;
}
