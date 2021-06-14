import { ExpoConfig, ConfigContext } from "@expo/config";

export default ({ config }: ConfigContext): ExpoConfig => ({
   ...config,
   name: "Poly",
   slug: "Poly",
   scheme: "com.poly.dates",
   privacy: "public",
   platforms: ["ios", "android", "web"],
   orientation: "portrait",
   icon: "./assets/icon.png",
   splash: {
      image: "./assets/splash.png",
      resizeMode: "cover",
      backgroundColor: "#000"
   },
   version: "1.0.6",
   android: {
      package: "com.poly.dates",
      versionCode: 106,
      useNextNotificationsApi: true,
      permissions: ["CAMERA", "CAMERA_ROLL", "ACCESS_COARSE_LOCATION", "ACCESS_FINE_LOCATION"],
      googleServicesFile: "./android/app/google-services.json"
   },
   ios: {
      bundleIdentifier: "com.poly.dates",
      buildNumber: "1.0.6",
      supportsTablet: false,
      infoPlist: {
         NSCameraUsageDescription:
            "This app uses the camera when the user wants to upload photos to his/her profile."
      }
   },
   updates: {
      fallbackToCacheTimeout: 0
   },
   assetBundlePatterns: ["**/*"],
   experiments: {
      turboModules: true
   }
});
