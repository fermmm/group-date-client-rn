import { ToastAndroid, Platform } from "react-native";
import { startActivityAsync, ActivityAction, IntentLauncherParams } from "expo-intent-launcher";
import Constants from "expo-constants";
import * as Linking from "expo-linking";

/**
 * Opens an intent on Android and a url on IOS. Useful open other apps or app settings.
 * @example
 *    import { ActivityAction } from "expo-intent-launcher";
 *    await openDeviceAction(
 *       ActivityAction.APPLICATION_DETAILS_SETTINGS,
 *       "app-settings:",
 *       dialogSettings.instructionsToastText
 *    );
 * @param activityAction Example: ActivityAction.APPLICATION_DETAILS_SETTINGS get it importing: import { ActivityAction } from "expo-intent-launcher";
 * @param urlIOS Not many links are supported in IOS, for app settings use: "app-settings:"
 * @param instructionsText A toast message on Android indicating what to do once the screen is displayed
 */
export function openDeviceAction(
   activityActionAndroid: ActivityAction,
   urlIOS: string,
   instructionsText?: string
): Promise<unknown> {
   if (Platform.OS === "ios") {
      return Linking.openURL(urlIOS);
   } else {
      instructionsText != null && ToastAndroid.show(instructionsText, ToastAndroid.LONG);

      /**
       * Some intents require specific params for some reason. Add them here every time you use this function
       * with a new intent.
       */
      const pkg = Constants.manifest.releaseChannel
         ? Constants.manifest.android.package
         : "host.exp.exponent";
      let params: IntentLauncherParams;
      switch (activityActionAndroid) {
         case ActivityAction.APPLICATION_DETAILS_SETTINGS:
            params = { data: "package:" + pkg };
            break;
         case ActivityAction.APP_NOTIFICATION_SETTINGS:
            params = { extra: { "android.provider.extra.APP_PACKAGE": pkg } };
            break;

         default:
            break;
      }

      return startActivityAsync(activityActionAndroid, params);
   }
}
