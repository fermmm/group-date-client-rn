import { ImageStyle, TextStyle, ViewStyle, StyleProp } from "react-native";

export interface GenericStyle { [key: string]: ViewStyle | TextStyle | ImageStyle; }
export type Styles<T = GenericStyle > = GenericStyle | T;
