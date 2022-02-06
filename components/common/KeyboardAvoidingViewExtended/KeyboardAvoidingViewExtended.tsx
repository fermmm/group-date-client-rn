import React, { FC } from "react";
import { KeyboardAvoidingView, Platform } from "react-native";

interface PropsKeyboardAvoidingView {
   disableOnAndroid?: boolean;
   disableOnIos?: boolean;
}

const KeyboardAvoidingViewExtended: FC<PropsKeyboardAvoidingView> = ({
   children,
   disableOnAndroid,
   disableOnIos
}) => {
   if (Platform.OS === "ios" && disableOnIos) {
      return <>{children}</>;
   }

   if (Platform.OS === "android" && disableOnAndroid) {
      return <>{children}</>;
   }

   return (
      <KeyboardAvoidingView behavior={"height"} style={{ flex: 1 }}>
         {children}
      </KeyboardAvoidingView>
   );
};

export default KeyboardAvoidingViewExtended;
