import * as Application from "expo-application";
import Constants, { AppOwnership } from "expo-constants";

export function getAppVersion(): Version {
   return {
      buildVersion:
         Constants.appOwnership !== AppOwnership.Expo
            ? Application.nativeApplicationVersion
            : Constants.manifest.version,
      codeVersion: Constants.manifest.version
   };
}

export interface Version {
   buildVersion: string;
   codeVersion: string;
}
