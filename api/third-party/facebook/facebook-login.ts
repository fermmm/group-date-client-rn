import { FacebookLoginResult, initializeAsync, logInWithReadPermissionsAsync } from "expo-facebook";
import { Alert } from "react-native";
import { Flatten } from "../../../common-tools/ts-tools/common-ts-tools";
import { FACEBOOK_APP_ID, FACEBOOK_APP_NAME } from "react-native-dotenv";

export async function facebookLogin(): Promise<void> {
  try {
    await initializeAsync(FACEBOOK_APP_ID, FACEBOOK_APP_NAME);
    const loginResult: FacebookLoginResult = await logInWithReadPermissionsAsync(
      {
        permissions: ["public_profile"]
      }
    );

    const {
      type,
      token,
      expires,
      permissions,
      declinedPermissions
    }: Flatten<Partial<FacebookLoginResult>> = loginResult;

    if (type === "success") {
      // Get the user's name using Facebook's Graph API
      const response: Response = await fetch(
        `https://graph.facebook.com/me?access_token=${token}`
      );
      Alert.alert("Logged in!", `Hi ${(await response.json()).name}! Token: ${token}`);
    } else {
      // type === 'cancel'
      Alert.alert("Vos lo cancelaste");
    }
  } catch ({ message }) {
      Alert.alert(`Facebook Login Error: ${message}`);
  }
}
