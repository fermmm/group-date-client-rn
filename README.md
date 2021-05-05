# Poly - Mobile Android / IOS app.

This project uses TypeScript + React Native + Expo with "managed" workflow.

## Installation

1. Make sure you have Node.js installed at least version 14, to verify run `node -v`. If you don't have it download from nodejs.org or better: [using NVM (Node Version Manager)](https://tecadmin.net/install-nodejs-with-nvm/)
2. Clone the repo, in the repo folder run `npm install`
3. Duplicate the file `.env.example` and rename it: `.env`. In Linux and MacOS you can use this command: 
  `cp .env.example .env`.
4. Create an empty file named `google-services.json` in the root of the project (where .env file is located).
This is required by expo to compile, the file will be empty but you will replace it with a real one when you publish the app in the future.
5. The login on this app works with Facebook and/or Google and you need to do some work to get any of the login systems up and running. The easiest to configure is Facebook: Create a Facebook app as Facebook developer and complete `FACEBOOK_APP_ID` and `FACEBOOK_APP_NAME` in the .env file. Also add `rRW++LUjmZZ+58EbN5DVhGAnkX4=` on the "Key Hashes" field in your Facebook app configuration (required for Expo Go). [More info here](https://docs.expo.io/versions/v36.0.0/sdk/facebook/#registering-your-app-with-facebook).
6. Install "Expo Go" app from your phone store, you will need it to test the app in your phone.
7. **(Optional)** Setup Google login: [Create a Web Expo Client Id](https://docs.expo.io/guides/authentication/#development-in-the-expo-go-app) and [an Android Client Id](https://docs.expo.io/guides/authentication/#android-native) and complete the .env file with them, both keys should look like ```123456789123-abcd123abcd123abcd123abcd123abcd123.apps.googleusercontent.com```

----

## To start coding and testing

```
npm start
```

----

## Publishing the app

For final build and publishing of the app you may find useful the [instructions on the Expo documentation](https://docs.expo.io/distribution/introduction/). Also before publishing the app there are some tasks required.

1. **Facebook login**: In step 5 of the installation process you added a key hash in your Facebook app settings, that is the key hash for the Expo Go app, you need to also add the key hash of your built application. To get the key hash make an android build and then run `expo fetch:android:hashes`. 

2. **Push notifications**: Push notifications works on Expo Go but in the built app you need to read and follow instructions under "Credentials" on [this page](https://docs.expo.io/push-notifications/push-notifications-setup/#credentials). After that you need to follow instructions on [this page](https://docs.expo.io/push-notifications/using-fcm/), and don't forget to follow instructions on the section "Uploading Server Credentials".
