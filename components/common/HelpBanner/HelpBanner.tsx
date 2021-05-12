import React, { FC, useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { Banner, Text } from "react-native-paper";
import color from "color";
import moment from "moment";
import { Styles } from "../../../common-tools/ts-tools/Styles";
import { currentTheme } from "../../../config";
import { useTheme } from "../../../common-tools/themes/useTheme/useTheme";
import { getUniqueHashOfString } from "../../../common-tools/js-tools/js-tools";
import {
   loadFromDevice,
   saveOnDevice
} from "../../../common-tools/device-native-api/storage/storage";

export interface PropsHelpBanner {
   text: string;
   showCloseButton?: boolean;
   coverContent?: boolean;
   animate?: boolean;
   rememberClose?: boolean;
   rememberCloseTimeInSeconds?: number;
}

export const HelpBanner: FC<PropsHelpBanner> = ({
   text,
   showCloseButton,
   coverContent,
   rememberClose,
   rememberCloseTimeInSeconds,
   animate = true
}) => {
   const { colors } = useTheme();
   const [visible, setVisible] = useState<boolean>(rememberClose ? false : true);

   useEffect(() => {
      if (rememberClose) {
         (async () => {
            const lastCloseDate = (await loadFromDevice<number>(getUniqueHashOfString(text))) ?? -1;
            if (
               lastCloseDate === -1 ||
               moment().unix() - lastCloseDate > rememberCloseTimeInSeconds
            ) {
               setVisible(true);
            }
         })();
      }
   }, []);

   const handleClose = async () => {
      if (rememberClose) {
         await saveOnDevice(getUniqueHashOfString(text), moment().unix());
      }
      setVisible(false);
   };

   if (!animate && !visible) {
      return null;
   }

   return (
      //@ts-ignore
      <Banner
         visible={visible}
         style={[styles.banner, coverContent ? styles.cover : {}]}
         actions={
            showCloseButton
               ? [
                    {
                       //@ts-ignore
                       labelStyle: styles.buttonStyle,
                       color: colors.specialBackground1,
                       label: "Entendido",
                       onPress: handleClose
                    }
                 ]
               : []
         }
      >
         <Text style={styles.text}>{text}</Text>
      </Banner>
   );
};

const styles: Styles = StyleSheet.create({
   banner: {
      backgroundColor: color(currentTheme.colors.background).darken(0.1).toString()
   },
   cover: {
      position: "absolute",
      width: "100%",
      zIndex: 1
   },
   buttonStyle: {
      color: currentTheme.colors.specialBackground1
   },
   text: {
      fontFamily: currentTheme.font.light,
      lineHeight: 19
   }
});
