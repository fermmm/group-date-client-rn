import { ImageStyle, TextStyle, ViewStyle } from "react-native";

export interface IGenericStyle { [key: string]: ViewStyle | TextStyle | ImageStyle; }
export type Styles<T = IGenericStyle > = IGenericStyle | T;
