import React, { FC } from "react";
import { StyleSheet, ImageBackground, View, StatusBar, Text } from "react-native";
import { Appbar } from "react-native-paper";
import { Styles } from "../../../common-tools/ts-tools/Styles";
import { currentTheme } from "../../../config";
import ShadowBottom from "../ShadowBottom/ShadowBottom";
import { useTheme } from "../../../common-tools/themes/useTheme/useTheme";
import { ThemeExt } from "../../../common-tools/themes/types/Themed";
import { useNavigation } from "../../../common-tools/navigation/useNavigation";

export interface AppBarHeaderProps {
   title?: string;
   showBackButton?: boolean;
   onBackPress?(): void;
   afterBackPress?(): void;
}

const AppBarHeader: FC<AppBarHeaderProps> = props => {
   const { title = "", showBackButton = true, onBackPress, afterBackPress, children } = props;
   const { goBack } = useNavigation();
   const theme: ThemeExt = useTheme();

   const handleBackPress = () => {
      onBackPress != null ? onBackPress() : goBack();
      afterBackPress != null && afterBackPress();
   };

   return (
      <View style={styles.mainContainer}>
         <ShadowBottom imageSource={theme.shadowBottom} />
         <Background useImageBackground={true}>
            <View style={styles.contentContainer}>
               {showBackButton && (
                  <Appbar.BackAction
                     color={theme.colors.text2}
                     onPress={handleBackPress}
                     style={{
                        marginRight: 25
                     }}
                  />
               )}
               <View
                  style={{
                     flex: 1
                  }}
               >
                  <Text style={styles.titleText}>{title}</Text>
               </View>
               {children}
            </View>
         </Background>
      </View>
   );
};

function Background(props: { children?: JSX.Element; useImageBackground: boolean }): JSX.Element {
   if (props.useImageBackground) {
      return (
         <ImageBackground source={currentTheme.backgroundImage} style={styles.imageBackground}>
            {props.children}
         </ImageBackground>
      );
   } else {
      return <View style={styles.colorBackground}>{props.children}</View>;
   }
}

const styles: Styles = StyleSheet.create({
   mainContainer: {
      position: "relative",
      width: "100%",
      height: 75
   },
   imageBackground: {
      flex: 1,
      width: "100%",
      justifyContent: "center",
      paddingTop: StatusBar.currentHeight
   },
   colorBackground: {
      flex: 1,
      width: "100%",
      justifyContent: "center",
      backgroundColor: currentTheme.colors.primary,
      paddingTop: StatusBar.currentHeight
   },
   contentContainer: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      paddingRight: 10,
      paddingLeft: 0
   },
   titleText: {
      color: currentTheme.colors.text2,
      fontSize: 16,
      fontFamily: currentTheme.font.medium
   }
});

export default AppBarHeader;
