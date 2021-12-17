import { ExpoConfig, ConfigContext } from "@expo/config";
import "dotenv/config";

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
   version: "1.2.1",
   android: {
      package: "com.poly.dates",
      versionCode: 121,
      useNextNotificationsApi: true,
      permissions: ["CAMERA", "CAMERA_ROLL", "ACCESS_COARSE_LOCATION", "ACCESS_FINE_LOCATION"],
      googleServicesFile: "./android/app/google-services.json"
   },
   ios: {
      bundleIdentifier: "com.poly.dates",
      buildNumber: "1.2.1",
      supportsTablet: false,
      infoPlist: {
         NSCameraUsageDescription:
            "This app uses the camera when the user wants to upload photos to his/her profile."
      }
   },
   web: {
      config: {
         firebase: {
            apiKey: process.env.API_KEY,
            authDomain: process.env.AUTH_DOMAIN,
            projectId: process.env.PROJECT_ID,
            storageBucket: process.env.STORAGE_BUCKET,
            messagingSenderId: process.env.MESSAGE_SENDER_ID,
            appId: process.env.APP_ID,
            measurementId: process.env.MEASUREMENT_ID
         }
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
