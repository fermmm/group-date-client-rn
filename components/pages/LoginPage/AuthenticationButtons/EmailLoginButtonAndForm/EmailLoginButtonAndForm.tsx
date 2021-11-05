import React, { FC } from "react";
import { StyleSheet } from "react-native";
import { Styles } from "../../../../../common-tools/ts-tools/Styles";
import ButtonStyled, { ButtonStyledProps } from "../../../../common/ButtonStyled/ButtonStyled";

export interface PropsEmailLoginButtonAndForm {
   onCredentialsTyped: () => void;
}

const EmailLoginButtonAndForm: FC<PropsEmailLoginButtonAndForm & ButtonStyledProps> = props => {
   const { onCredentialsTyped } = props;

   // TODO: Implementar la UI de los formularios
   const handleButtonPress = () => {
      // onCredentialsTyped();
   };

   return (
      <ButtonStyled {...props} onPress={handleButtonPress}>
         {props.children}
      </ButtonStyled>
   );
};

const styles: Styles = StyleSheet.create({});

export default EmailLoginButtonAndForm;
