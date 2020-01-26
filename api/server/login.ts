import { facebookTokenIsValid } from "../third-party/facebook/facebook-login";
import { loadFromDeviceSecure } from "../../common-tools/device-native-api/storage/storage";

export async function tryGetStoredSession(): Promise<string | null> {
   const storedToken: string = await loadFromDeviceSecure("pdfbtoken");
   if (storedToken == null) {
      return Promise.resolve(null);
   }
   if (!(await facebookTokenIsValid(storedToken))) {
      return Promise.resolve(null);
   }
   return Promise.resolve(storedToken);
}

export async function login(token: string | null): Promise<boolean> {
   if (token == null) {
      return Promise.resolve(false);
   }
   console.log("Valid token! call server: " + token);
   // TODO: Implement login server call here
   Promise.resolve(true);
}
