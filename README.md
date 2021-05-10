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

6. The login on this app works with Facebook and/or Google and you need to do some work to get any of the login systems up and running. The easiest to configure is Facebook: [Create a Facebook app as Facebook developer](https://developers.facebook.com/docs/development/create-an-app/) and then use the resulting app info to complete `FACEBOOK_APP_ID` and `FACEBOOK_APP_NAME` in the .env file. Also add `rRW++LUjmZZ+58EbN5DVhGAnkX4=` on the "Key Hashes" field in your Facebook app configuration (required to authorize Expo Go to use your Facebook app). [More info here](https://docs.expo.io/versions/v36.0.0/sdk/facebook/#registering-your-app-with-facebook).

7. **(Optional)** Setup Google login: First you need to create a signed build of the app because the credentials when signing are used by Google login, so follow the "Required setup steps to make a debug or release build" in this readme. After that follow these steps:
    1. [Open this link](https://docs.expo.io/guides/authentication/#development-in-the-expo-go-app), follow the instructions under "Development in the Expo Go app" and "Android Native". First you may need to create the app in Google Cloud Platform. Also if you see an instruction that says "select 'Generate new keystore' option" follow it only if you see "----------------" under "Upload keystore hashes", otherwise use the ones displayed.
  
    2. Complete the .env file with the keys you get when following those steps, both keys should look like: ```123456789123-abcd123abcd123abcd123abcd123abcd123.apps.googleusercontent.com```.

    3. After making these changes the google-services.json file changes, so you must re-download it. To do that go to [firebase console](https://console.firebase.google.com/), create a project if you don't have it and go to the gear button on the top left next to the "Project Overview" and then click on "Project Settings", scroll down and click on the google-services.json button to download the updated file, copy the file to android/app folder.

    If you have any problem [this troubleshooting tutorial](https://github.com/react-native-google-signin/google-signin/blob/master/docs/android-guide.md#faq--troubleshooting) could help.

----

## Start coding and testing

```
npm start
```
This displays a QR. On Android Scan the QR with the Expo Go app. In IOS create an Expo account.

----

## Required setup steps to make a debug or release build

Up until now you were running the app in Expo Go. But that is just a wrapper app of the JS code just for debugging and coding. The real app needs to be built in a different way:

1. You must at least once open the android folder with [Android Studio](https://developer.android.com/studio) because that installs required packages. After that you must run ```npm run emulator:android``` at least once because also installs some required packages.

2. You need a keystore file to sign the app build: We recommend to use Expo service to generate and store the keystore: Create an account on [expo.io](https://expo.io/) and create a project.

3. Run credentials manager: ```npm run credentials``` -> Android -> Select your project

4. If you see "----------------" under "Upload keystore hashes" it means you don't have a keystore, so you can generate a new one: Select: "Update upload Keystore" -> "Generate new keystore" -> "Go back to experience overview" -> Select your project -> Download keystore from the expo servers -> Answer Yes to display the keystore credentials, now you should see something like this: 

```
Keystore credentials
  Keystore password: 123456789abc
  Key alias:         123456789abc=
  Key password:      123456789abc
```

5. Copy that information in a safe place because that is like a "triple password" required to sign your build, signing your build means to be recognized as the author of the app and being able to send updates.

6. Also to sign your build you need a file that you only have, the .jks file, you should have it in the root of your project. Rename the .jks file to upload_keystore.jks and move it to the android folder

7. Create a file inside the android folder called keystore.properties with the following content (don't use any quotes ""):

```
  storeFile=../upload_keystore.jks
  storePassword=THE STORE PASSWORD FROM STEP 4
  keyAlias=THE KEY ALIAS FROM STEP 4
  keyPassword=THE KEY PASSWORD FROM STEP 4
```
8. **Facebook login**: In the last part of step 6 of "Installation" in this readme you added the Expo Go "Facebook Key Hash" in your Facebook app settings, that is the key hash to authorize the Expo Go app to login with your Facebook app. When building your standalone .apk or .pem it has it's own Facebook Key Hash, you need to also authorize that. To get the Facebook Key Hash of your build run `expo fetch:android:hashes`, and repeat the last part of step 6 with that key.

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

## Make a quick update

```
npm run publish
```
The users will download the latest JS code when booting the app and run it at restart if the code finished downloading in the background. Useful to send updates without requiring the users to go to Google Play. Some native code changes require a new build, not just the JS code in that case you need to create a .pem traditional build and upload it to google play.
Also new installations comes with the code at the moment of .pem build. So they will run the old version at first boot, to prevent this you still have to upload each new version to Google Play.  

----

## Publishing the app

For final build and publishing of the app you may find useful the [instructions on the Expo documentation](https://docs.expo.io/distribution/introduction/).




