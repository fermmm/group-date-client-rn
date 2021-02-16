import React, { FC, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Banner } from "react-native-paper";
import color from "color";
import { Styles } from "../../../common-tools/ts-tools/Styles";
import { currentTheme } from "../../../config";
import { useTheme } from "../../../common-tools/themes/useTheme/useTheme";

export interface PropsHelpBanner {
   text: string;
   showCloseButton?: boolean;
   coverContent?: boolean;
   animate?: boolean;
}

export const HelpBanner: FC<PropsHelpBanner> = ({
   text,
   showCloseButton,
   coverContent,
   animate = true
}) => {
   const { colors } = useTheme();
   const [visible, setVisible] = useState<boolean>(true);

   if (!animate && !visible) {
      return null;
   }

   return (
      <Banner
         visible={visible}
         style={[styles.banner, coverContent ? styles.cover : {}]}
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
      elevation: 12
   },
   cover: {
      position: "absolute",
      width: "100%",
      zIndex: 1
   },
   buttonStyle: {
      color: currentTheme.colors.specialBackground1
   }
});
