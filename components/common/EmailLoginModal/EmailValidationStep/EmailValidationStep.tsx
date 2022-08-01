import React, { FC, useEffect, useRef, useState } from "react";
import { Alert, StyleSheet, View } from "react-native";
import { Button } from "react-native-paper";
import { EmailLoginCredentials } from "../../../../api/server/shared-tools/endpoints-interfaces/email-login";
import { useAppState } from "../../../../common-tools/device-native-api/state/useAppState";
import { useTheme } from "../../../../common-tools/themes/useTheme/useTheme";
import { Styles } from "../../../../common-tools/ts-tools/Styles";
import { currentTheme, LOCALHOST_MODE } from "../../../../config";
import TitleMediumText from "../../TitleMediumText/TitleMediumText";
import TitleText from "../../TitleText/TitleText";
import {
   emailLoginCreateAccountPost,
   useEmailLogin,
   userExistsGet
} from "../../../../api/server/email-login";
import { openEmailApp } from "../../../../common-tools/device-native-api/device-action/openEmailApp";
import { tryToGetErrorMessage } from "../../../../api/tools/httpRequest";
import { LoadingAnimation } from "../../LoadingAnimation/LoadingAnimation";
import { getLinkToApp } from "../../../../common-tools/navigation/getLinkToApp";

export interface PropsEmailValidationStep {
   title?: string;
   subtitle?: string;
   onValidationConfirmed: (token: string) => void;
   onAccountAlreadyExists: () => void;
   onBackPress?: () => void;
   credentials: EmailLoginCredentials;
   stepIsFocused: boolean;
}

const EmailValidationStep: FC<PropsEmailValidationStep> = props => {
   const {
      onValidationConfirmed,
      onBackPress,
      onAccountAlreadyExists,
      title,
      subtitle,
      credentials,
      stepIsFocused
   } = props;

   const theme = useTheme();
   const applicationState = useAppState();
   const appStatePreviousValue = useRef(applicationState.isActive);
   const [accountAlreadyExists, setAccountAlreadyExists] = useState<boolean>(null);
   const emailSent = useRef(false);
   const [isLoading, setIsLoading] = useState(false);

   // This re-fetches the token every 5 seconds to check if the user has confirmed the email
   const { data: tokenFromServer, revalidate: refetchTokenFromServer } = useEmailLogin({
      requestParams: credentials,
      silentErrors: true,
      config: {
         enabled: stepIsFocused && accountAlreadyExists === false,
         refreshInterval: 5000,
         showAlertOnError: false
      }
   });

   /* Effect check if the account already exists */
   useEffect(() => {
      if (
         !stepIsFocused ||
         accountAlreadyExists != null ||
         !credentials ||
         !credentials.email ||
         !credentials.password
      ) {
         return;
      }

      setIsLoading(true);
      userExistsGet({ email: credentials.email })
         .then(response => {
            setIsLoading(false);
            if (!response?.userExists) {
               setAccountAlreadyExists(false);
            } else {
               setAccountAlreadyExists(true);
               onAccountAlreadyExists();
            }
         })
         .catch(error => {
            setIsLoading(false);
            setAccountAlreadyExists(false);
         });
   }, [stepIsFocused, credentials, accountAlreadyExists]);

   /* Effect to call create account endpoint which sends the email to verify account */
   useEffect(() => {
      if (!stepIsFocused || accountAlreadyExists !== false || emailSent.current) {
         return;
      }

      const appUrl = getLinkToApp();

      setIsLoading(true);
      emailLoginCreateAccountPost({ ...credentials, appUrl, logLinkOnConsole: LOCALHOST_MODE })
         .then(() => {
            setIsLoading(false);
         })
         .catch(error => {
            setIsLoading(false);
            Alert.alert("", tryToGetErrorMessage(error));
         });
      emailSent.current = true;
   }, [stepIsFocused, accountAlreadyExists]);

   /*
    * Effect to check if the user validated the email when the app switches to foreground.
    * So the user doesn't have to wait 5 seconds to re-check email validation.
    * This is useful when the user goes to the mails app and then comes back to the app.
    * */
   useEffect(() => {
      if (!applicationState.isActive) {
         appStatePreviousValue.current = applicationState.isActive;
         return;
      }

      if (!stepIsFocused) {
         appStatePreviousValue.current = applicationState.isActive;
         return;
      }

      if (applicationState.isActive === appStatePreviousValue.current) {
         return;
      }

      if (accountAlreadyExists !== false) {
         return;
      }

      refetchTokenFromServer();
   }, [applicationState.isActive, stepIsFocused, accountAlreadyExists]);

   /* Effect to continue when the user successfully validated the email */
   useEffect(() => {
      if (!tokenFromServer?.token || accountAlreadyExists !== false) {
         return;
      }

      onValidationConfirmed(tokenFromServer.token);
   }, [tokenFromServer?.token, accountAlreadyExists]);

   const handleOpenEmailAppPress = () => {
      openEmailApp();
   };

   if (isLoading) {
      return <LoadingAnimation />;
   }

   return (
      <View style={styles.stepContainer}>
         {title != null && <TitleText style={styles.title}>{title}</TitleText>}
         {subtitle != null && <TitleMediumText>{subtitle}</TitleMediumText>}
         <Button
            onPress={handleOpenEmailAppPress}
            mode="outlined"
            color={theme.colors.accent2}
            style={[styles.button, { marginBottom: 10 }]}
         >
            Abrir app de emails
         </Button>
         {onBackPress != null && (
            <Button
               onPress={onBackPress}
               mode="outlined"
               color={theme.colors.accent2}
               style={styles.button}
            >
               Volver
            </Button>
         )}
      </View>
   );
};

const styles: Styles = StyleSheet.create({
   stepContainer: {
      paddingLeft: 20,
      paddingRight: 20
   },
   button: {
      borderColor: currentTheme.colors.accent2,
      minWidth: 180
   },
   title: {}
});

export default EmailValidationStep;
