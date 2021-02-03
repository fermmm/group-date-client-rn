import React, { FC, ReactNode, useState } from "react";
import { StyleSheet, Text } from "react-native";
import { Banner } from "react-native-paper";
import color from "color";
import { Styles } from "../../../common-tools/ts-tools/Styles";
import { currentTheme } from "../../../config";

export interface PropsHelpBanner {
   text: string;
   showCloseButton?: boolean;
}

export const HelpBanner: FC<PropsHelpBanner> = ({ text, showCloseButton }) => {
   const [visible, setVisible] = useState<boolean>(true);

   return (
      <Banner
         visible={visible}
         style={styles.banner}
         actions={
            showCloseButton
               ? [
                    {
                       label: "Entendido",
                       onPress: () => setVisible(false)
                    }
                 ]
               : []
         }
      >
         {text}
      </Banner>
   );
};

const styles: Styles = StyleSheet.create({
   banner: {
      backgroundColor: color(currentTheme.colors.background).darken(0.15).toString(),
      elevation: 12,
      marginBottom: 25
   }
});
