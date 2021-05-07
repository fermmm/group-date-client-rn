import { Alert, Linking } from "react-native";
import { httpRequest } from "../../../tools/httpRequest";

export async function checkGoogleToken(token: string) {
   const response: { email: string } = await httpRequest({
      baseURL: `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${token}`,
      errorResponseSilent: true,
      handleErrors: true
   });

   Alert.alert("", `Token to check: ${token} result: ${JSON.stringify(response)}`, [
      {
         text: "OK"
      },
      {
         text: "Navigate",
         onPress: () =>
            Linking.openURL(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${token}`)
      }
   ]);
   // ;

   return { valid: response?.email != null };
}
