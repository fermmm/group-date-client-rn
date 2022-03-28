import { Platform, NativeModules } from "react-native";

/**
 * Returns the system language.
 */
export function getSystemLanguage(): SystemLanguage {
   let fullLanguageCode: string =
      (Platform.OS === "ios"
         ? NativeModules.SettingsManager.settings.AppleLocale ??
           NativeModules.SettingsManager.settings.AppleLanguages[0] //iOS 13
         : NativeModules.I18nManager.localeIdentifier) ?? "en-US";
   fullLanguageCode = fullLanguageCode.replace("_", "-"); // Different platforms use different separators

   const mainLanguage = fullLanguageCode.split("-")[0];

   return { fullLanguageCode, mainLanguage };
}

export interface SystemLanguage {
   /**
    * The full language code, e.g. "en-US"
    */
   fullLanguageCode: string;

   /**
    * The main language code, e.g. "en"
    */
   mainLanguage: string;
}
