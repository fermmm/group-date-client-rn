import { ImageStyle, TextStyle, ViewStyle } from "react-native";

export type GenericStyle = { [key: string]: ViewStyle | TextStyle | ImageStyle };
export type Styles<T = GenericStyle > = GenericStyle | T;