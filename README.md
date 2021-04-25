# Poly - Mobile Android / IOS app.

This project uses TypeScript + React Native + Expo with "managed" workflow. For final build and publishing of the app you may find useful the [instructions on the Expo documentation](https://docs.expo.io/distribution/introduction/) and also read "Publishing the app" section in this readme.

## Installation

1. Make sure you have Node.js installed at least version 14, to verify run `node -v`. If you don't have it download from nodejs.org or better: [using NVM (Node Version Manager)](https://tecadmin.net/install-nodejs-with-nvm/)
2. Clone the repo, in the repo folder run `npm install`
3. Duplicate the file `.env.example` and rename it: `.env`. In Linux and MacOS you can use this command: 
  `cp .env.example .env`.
5. The login on this app works with Facebook, so you must create a Facebook app as Facebook developer and complete `FACEBOOK_APP_ID` and `FACEBOOK_APP_NAME` in the .env file. Also add `rRW++LUjmZZ+58EbN5DVhGAnkX4=` on the "Key Hashes" field in your Facebook app configuration. [More info here](https://docs.expo.io/versions/v36.0.0/sdk/facebook/#registering-your-app-with-facebook).
6. Install "Expo Go" app from your phone store, you will need it to test the app in your phone.

----

## To start coding and testing

```
npm start
```

----

## Publishing the app

Before publishing the app there are some tasks required.

1. **Facebook login**: In step 4 of the installation process you added a key hash in your Facebook app settings, that is the key hash for the Expo Go app, you need to also add the key hash of your built application. To get the key hash make an android build and then run `expo fetch:android:hashes`. 

2. **Push notifications**: Push notifications works on Expo Go but in the built app you need to read and follow instructions under "Credentials" on [this page](https://docs.expo.io/push-notifications/push-notifications-setup/#credentials).
