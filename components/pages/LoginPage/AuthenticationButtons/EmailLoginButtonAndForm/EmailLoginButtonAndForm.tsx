import React, { FC, useState } from "react";
import { StyleSheet } from "react-native";
import { Styles } from "../../../../../common-tools/ts-tools/Styles";
import ButtonStyled, { ButtonStyledProps } from "../../../../common/ButtonStyled/ButtonStyled";
import EmailLoginForm from "./EmailLoginForm/EmailLoginForm";

export interface PropsEmailLoginButtonAndForm {
   onCredentialsTyped: () => void;
}

const EmailLoginButtonAndForm: FC<PropsEmailLoginButtonAndForm & ButtonStyledProps> = props => {
   const { onCredentialsTyped } = props;
   const [loginModalOpen, setLoginModalOpen] = useState(false);

   const handleButtonPress = () => {
      setLoginModalOpen(true);
   };

   const onLoginModalClose = () => {
      // onCredentialsTyped();
      setLoginModalOpen(false);
   };

   return (
      <>
         <ButtonStyled {...props} onPress={handleButtonPress}>
            {props.children}
         </ButtonStyled>
         {loginModalOpen && <EmailLoginForm onClose={onLoginModalClose} />}
      </>
   );
};

const styles: Styles = StyleSheet.create({});

export default EmailLoginButtonAndForm;
