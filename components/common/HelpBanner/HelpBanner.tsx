import React, { FC, useState } from "react";
import { StyleSheet } from "react-native";
import { Banner } from "react-native-paper";
import color from "color";
import { Styles } from "../../../common-tools/ts-tools/Styles";
import { currentTheme } from "../../../config";
import { useTheme } from "../../../common-tools/themes/useTheme/useTheme";

export interface PropsHelpBanner {
   text: string;
   showCloseButton?: boolean;
}

export const HelpBanner: FC<PropsHelpBanner> = ({ text, showCloseButton }) => {
   const { colors } = useTheme();
   const [visible, setVisible] = useState<boolean>(true);

   return (
      <Banner
         visible={visible}
         style={styles.banner}
         actions={
            showCloseButton
               ? [
                    {
                       //@ts-ignore
                       labelStyle: styles.buttonStyle,
                       //@ts-ignore
                       color: colors.specialBackground1,
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
   },
   buttonStyle: {
      color: currentTheme.colors.specialBackground1
   }
});
