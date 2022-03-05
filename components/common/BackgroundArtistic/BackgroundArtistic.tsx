import React, { FC, ReactNode } from "react";
import { ImageBackground, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "../../../common-tools/themes/useTheme/useTheme";
import { Styles } from "../../../common-tools/ts-tools/Styles";

interface PropsBackgroundArtistic {
   children?: ReactNode;
   useImageBackground?: boolean;
   gradientColor1?: string;
   gradientColor2?: string;
   gradientStart?: number;
   gradientEnd?: number;
}

const BackgroundArtistic: FC<PropsBackgroundArtistic> = props => {
   const {
      children,
      useImageBackground,
      gradientColor1,
      gradientColor2,
      gradientStart,
      gradientEnd
   } = props;
   const { backgroundImage, colors } = useTheme();

   if (useImageBackground) {
      return (
         <ImageBackground source={backgroundImage} style={styles.background}>
            {children}
         </ImageBackground>
      );
   } else {
      return (
         <LinearGradient
            colors={[
               gradientColor1 ?? colors.specialBackground1,
               gradientColor2 ?? colors.specialBackground2
            ]}
            style={styles.background}
            start={[0, gradientStart ?? 0.5]}
            end={[0, gradientEnd ?? 1.3]}
         >
            {children}
         </LinearGradient>
      );
   }
};

const styles: Styles = StyleSheet.create({
   background: {
      flex: 1,
      width: "100%",
      alignItems: "center",
      justifyContent: "flex-end"
   }
});

export default React.memo(BackgroundArtistic);
