# Poly - Mobile Android / IOS app.

This project uses TypeScript + React Native + Expo with "bare" workflow (not the "managed" workflow).

## Installation

1. Make sure you have Node.js installed at least version 14, to verify run `node -v`. If you don't have it download from nodejs.org or better: [using NVM (Node Version Manager)](https://tecadmin.net/install-nodejs-with-nvm/).

2. Clone the repo, in the repo folder run `npm install`

3. Duplicate the file `.env.example` and rename it: `.env`. In Linux and MacOS you can use this command: 
  `cp .env.example .env`.

4. Create an empty file named `google-services.json` inside android/app folder.
This is required by expo to compile, the file will be empty but you will replace it with a real one in the future.

5. Install "Expo Go" app from your phone store, you will need it to test the app in your phone.

6. You need to create your own package identifier, it's a string identifier for your app, the current one is on app.json > ```expo.android.package```. Search for that package name inside all the project files using your code editor and replace the current one by a new one everywhere, the new identifier can be whatever you want in this format "com.whatever.anything", use your creativity, the only important thing is no other app published has the same identifier.

7. The login on this app works with Facebook and/or Google and you need to do some work to get any of the login systems up and running. The easiest to configure is Facebook: [Create a Facebook app as Facebook developer](https://developers.facebook.com/docs/development/create-an-app/) and then use the resulting app info to complete `FACEBOOK_APP_ID` and `FACEBOOK_APP_NAME` in the .env file. Also add `rRW++LUjmZZ+58EbN5DVhGAnkX4=` on the "Key Hashes" field in your Facebook app configuration (required to authorize Expo Go to use your Facebook app). [More info here](https://docs.expo.io/versions/v36.0.0/sdk/facebook/#registering-your-app-with-facebook).

8. **(Optional)** Setup Google login: First you need to create a signed build of the app because the credentials when signing are used by Google login, so follow the "Required setup steps to make a debug or release build" in this readme. After that follow these steps:
    1. [Open this link](https://docs.expo.io/guides/authentication/#development-in-the-expo-go-app), follow the instructions under "Development in the Expo Go app" and "Android Native". First you may need to create the app in Google Cloud Platform. Also if you see an instruction that says "select 'Generate new keystore' option" follow it only if you see "----------------" under "Upload keystore hashes", otherwise use the ones displayed.
  
    2. Complete the GOOGLE_CLIENT_WEB_EXPO value in the .env file with the key you get when following "Development in the Expo Go app", the key should look like: ```123456789123-abcd123abcd123abcd123abcd123abcd123.apps.googleusercontent.com```.

    3. After doing the steps above you should see the "Login with Google" button if you are not logged in.

    If you have any problem [this troubleshooting tutorial](https://github.com/react-native-google-signin/google-signin/blob/master/docs/android-guide.md#faq--troubleshooting) could help.

----

## Start coding and testing

```
npm start
```
This displays a QR. On Android Scan the QR with the Expo Go app. In IOS create an Expo account first.
You also need to have the server running on your local computer so the app can connect to something.

----

## Required setup steps to make a debug or release build

Up until now you were running the app in Expo Go. But that is just a wrapper app of the JS code just for debugging and coding. The real app needs to be built in a different way:

1. You need a keystore file to sign the app build: We recommend to use Expo service to generate and store the keystore: Create an account on [expo.io](https://expo.io/) and create a project.

2. Run credentials manager: ```npm run credentials``` -> Android -> Select your project

3. If you see "----------------" under "Upload keystore hashes" it means you don't have a keystore, so you can generate a new one: Select: "Update upload Keystore" -> "Generate new keystore" -> "Go back to experience overview" -> Select your project -> Download keystore from the expo servers -> Answer Yes to display the keystore credentials, now you should see something like this: 

```
Keystore credentials
  Keystore password: 123456789abc
  Key alias:         123456789abc=
  Key password:      123456789abc
```

4. Copy that information in a safe place because that is like a "triple password" required to sign your build, signing your build means to be recognized as the author of the app and being able to send updates.

5. Also to sign your build you need a file that only you should have, the .jks file, by following the previous step you should have it in the root of your project. Rename the .jks file to upload_keystore.jks and move it to the android folder

6. Create a file inside the android folder called keystore.properties with the following content (don't use any quotes ""):

```
  storeFile=../upload_keystore.jks
  storePassword=THE STORE PASSWORD FROM STEP 4
  keyAlias=THE KEY ALIAS FROM STEP 4
  keyPassword=THE KEY PASSWORD FROM STEP 4
```

7. You must at least once open the android folder with [Android Studio](https://developer.android.com/studio) because that installs required packages. After that you must run ```npm run emulator:android``` at least once because also installs some required packages.

8. **Facebook login**: In the last part of step 7 of "Installation" in this readme you added the Expo Go "Facebook Key Hash" in your Facebook app settings, that is the key hash to authorize the Expo Go app to login with your Facebook app. When building your standalone .apk or .pem it has it's own Facebook Key Hash, you need to also authorize that. To get the Facebook Key Hash of your build run `expo fetch:android:hashes`, and repeat the last part of step 7 with that key.

9. **Push notifications**: Push notifications works on Expo Go but in the built app you need to read and follow instructions under "Credentials" on [this page](https://docs.expo.io/push-notifications/push-notifications-setup/#credentials). After that you need to follow instructions on [this page](https://docs.expo.io/push-notifications/using-fcm/), and don't forget to follow instructions on the section "Uploading Server Credentials". Note: The google-services file goes into android/app folder.


## Make a debug or release build

Create .apk file:
```
npm run build:apk
```
The build will be on android/app/build/outputs/apk/release

Create bundle .aab to upload to Google Play
```
npm run build:bundle
```
The build will be on android/app/build/outputs/bundle/release

----

## Run in emulator:

This is an alternative way to debug and code with live updating, similar to Expo Go but uses a real built .apk. In this approach the libraries that has native logic works (in Expo Go only expo native libraries work), this means you have all the features of the app working on this mode, the downside is that the performance and confort is worst.
To be able to use this you need at least once to follow the instructions on this readme under "Required setup steps to make a debug or release build".

Open an emulator device using AVD manager in Android Studio: Tools -> AVD Manager. Then follow this:

```
npm run start:native
```

In another terminal:

```
npm run emulator:android
```

In this mode the app will connect to the server on the url of SERVER_URL_PRODUCTION (.env file)

## Make a quick update

```
npm run publish
```
**What is this**: The JS code of your app is hosted in the expo servers for free and can be updated in the already installed apps. The app downloads the latest code at boot and applies the new code on the next boot.This is useful to send updates quickly without approval waiting and without requiring the users to go to Google Play or App Store and update the app manually. Some native code changes require a new build, in that case the users need to update in the traditional way.
Also new installations comes with the code at the moment of the build, so they will run the old version at first boot, and the new version on second boot. To prevent problems on new users because of this you should also upload each new version to the stores.

----

## Increment version number

1. Open ```app.json``` and change: ```expo.version```, ```expo.android.versionCode``` and ```expo.ios.buildNumber```
2. Open ```build.gradle``` and change: ```android.defaultConfig.versionCode``` and ```android.defaultConfig.versionName```
3. Open ```ios/Poly/info.plist``` and change the tag below ```CFBundleShortVersionString``` and ```CFBundleVersion```

The version number (except for android.versionCode) should be in [this format](https://developer.apple.com/library/archive/documentation/General/Reference/InfoPlistKeyReference/Articles/CoreFoundationKeys.html#//apple_ref/doc/uid/20001431-102364)

## Publishing the app

For final build and publishing of the app you may find useful the [instructions on the Expo documentation](https://docs.expo.io/distribution/introduction/). Also you may need to do the following:

1. **Change the icons**: Once you have your icon designed use "Asset Studio" inside Android Studio to export your icon in all the sizes required by an app. Open Android Studio, inside the "project" panel select the folder app/res, then click on File > New > Image asset, import the source asset (your icon image) and follow instructions to generate the images, the images will be generated in the correct folders, build and enjoy.

2. **Change app bundle identifier**: If you didn't do this in the setup steps or the store required you to change the app package identifier, the current one is on app.json > ```expo.android.package```. Search for that package name inside all the project files using your code editor and replace the current one by the new one. If you followed the steps required to setup notifications you have to repeat all of them with the new package name, which implies creating a new app in Firebase. If you followed the steps required to setup google login you need to change the package name in the android client of the Google Cloud platform credentials setup. Also the Facebook app must have the updated identifier.

3. **Facebook login**: When you publish your app in Google Play and test it you'll notice a Key Hash error when login with Facebook, this is because when uploading an .aap bundle the final app is signed by Google Play with their own key, you need to add this key to the facebook app configuration:
    1. In Google Play Console, on the left panel under "Release" go to Setup -> App Integrity, copy the "SHA-1 certificate fingerprint", the one that is under "App signing key certificate"
    2. Convert the SHA-1 key you copied into the base64 format that Facebook requires by running this command (replace YOUR_COPIED_SHA1_KEY):

        ```echo YOUR_COPIED_SHA1_KEY | xxd -r -p | openssl base64```
    
    3. Paste the base64 code returned into the "Key Hashes" field in your Facebook app configuration

4. **Google login**: As mentioned in the previos step Google Play signs your app so also Google login is affected:
    1. In Google Play Console, on the left panel under "Release" go to Setup -> App Integrity, copy the "SHA-1 certificate fingerprint", the one that is under "App signing key certificate"
    2. Go to the [https://console.cloud.google.com/apis/credentials](credentials page) of Google Cloud, then click on "+ Create credentials" -> "OAuth client ID" -> android -> paste the corresponding field the SHA-1 copied in the previous step, then click create. Now google login should work on the published app.
 