// This removed typescript errors for lines like this: import mySvg from "./mySvg.svg";
declare module "*.svg" {
   const value: string;
   export = value;
}
