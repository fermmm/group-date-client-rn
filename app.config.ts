import { ExpoConfig, ConfigContext } from "@expo/config";
import "dotenv/config";
import {
   API_KEY,
   APP_ID,
   AUTH_DOMAIN,
   MEASUREMENT_ID,
   MESSAGE_SENDER_ID,
   PROJECT_ID,
   STORAGE_BUCKET
} from "./env.config";

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
      backgroundColor: "#000000"
   },
   version: "1.4.2",
   android: {
      package: "com.poly.dates",
      versionCode: 142,
      useNextNotificationsApi: true,
      permissions: ["CAMERA", "CAMERA_ROLL", "ACCESS_COARSE_LOCATION", "ACCESS_FINE_LOCATION"],
      googleServicesFile: "./android/app/google-services.json"
   },
   ios: {
      bundleIdentifier: "com.poly.dates",
      buildNumber: "1.4.2",
      supportsTablet: false,
      infoPlist: {
         CFBundleAllowMixedLocalizations: true,
         NSCameraUsageDescription: "The app only access your camera while you take the photo.",
         NSLocationAlwaysAndWhenInUseUsageDescription:
            "It will be used to find people in your area and auto complete your city name at registration.",
         NSLocationAlwaysUsageDescription:
            "It will be used to find people in your area and auto complete your city name at registration.",
         NSLocationWhenInUseUsageDescription:
            "It will be used to find people in your area and auto complete your city name at registration.",
         NSMicrophoneUsageDescription:
            "This is required to make the camera work, we don't use the microphone.",
         NSPhotoLibraryUsageDescription: "The app only has access to the photos you select."
      }
   },
   locales: {
      es: "./texts/appConfig/es.json"
   },
   web: {
      config: {
         firebase: {
            apiKey: API_KEY,
            authDomain: AUTH_DOMAIN,
            projectId: PROJECT_ID,
            storageBucket: STORAGE_BUCKET,
            messagingSenderId: MESSAGE_SENDER_ID,
            appId: APP_ID,
            measurementId: MEASUREMENT_ID
         }
      }
   },
   updates: {
      fallbackToCacheTimeout: 0
   },
   assetBundlePatterns: ["**/*"],
   experiments: {
      turboModules: true
   },
   plugins: [
      [
         "expo-image-picker",
         {
            photosPermission: "The app only has access to the photos you select."
         }
      ]
      // [
      //    "expo-facebook",
      //    {
      //       userTrackingPermission: false
      //    }
      // ]
   ]
});
