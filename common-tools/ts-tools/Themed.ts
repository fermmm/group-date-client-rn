import { Theme } from "react-native-paper/typings";

export interface ITheme extends Theme{
    backgroundImage?: {};
}

export interface IThemed { 
    theme: ITheme; 
}
