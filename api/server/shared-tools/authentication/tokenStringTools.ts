import { AuthenticationProvider } from "./AuthenticationProvider";

/**
 * Creates a extended info token, this is a string that contains the authentication provider + token.
 * Is useful to keep provider information in the token string because can be used in different places
 * to perform specific actions depending on the authentication provider.
 *
 * For example the extended info token returned for Facebook looks like this: "Facebook[poly]abc1234".
 * The [poly] string will be used by getTokenInfo() to divide the string and parse the data.
 *
 * If the token is already an extended info token then it will be returned as is.
 */
export function createExtendedInfoToken(props: {
   originalToken: string;
   provider: AuthenticationProvider;
}): string {
   if (props.originalToken == null) {
      return null;
   }

   if (props.originalToken.includes("[poly]")) {
      return props.originalToken;
   }

   return `${props.provider}[poly]${props.originalToken}`;
}

/**
 * Extracts information from an extended info token created with createExtendedInfoToken().
 */
export function getTokenInfo(extendedInfoToken: string): TokenInfo {
   if (extendedInfoToken == null) {
      return null;
   }

   const spitted = extendedInfoToken.split("[poly]");

   if (spitted.length !== 2) {
      console.error("Error: The token provided is not valid or extended info token: " + extendedInfoToken);
      return null;
   }

   return {
      provider: spitted[0] as AuthenticationProvider,
      originalToken: spitted[1],
   };
}

export interface TokenInfo {
   originalToken: string;
   provider: AuthenticationProvider;
}
