import React, { Component } from "react";
import { StyleSheet, ImageBackground, View, StatusBar, Text } from "react-native";
import { withTheme, Appbar } from "react-native-paper";
import { Themed } from "../../../common-tools/themes/types/Themed";
import { Styles } from "../../../common-tools/ts-tools/Styles";
import { withNavigation, StackScreenProps, NavigationScreenProp } from "@react-navigation/stack";
import { currentTheme } from "../../../config";
import ShadowBottom from "../ShadowBottom/ShadowBottom";

export interface AppBarHeaderProps extends Themed, StackScreenProps<{}> {
   title?: string;
   showBackButton?: boolean;
   onBackPress?(): void;
}
export interface AppBarHeaderState {}

class AppBarHeader extends Component<AppBarHeaderProps, AppBarHeaderState> {
   static defaultProps: Partial<AppBarHeaderProps> = {
      title: "",
      showBackButton: true
   };

   render(): JSX.Element {
      const { goBack }: StackNavigationProp<Record<string, {}>> = this.props.navigation;
      return (
         <View style={styles.mainContainer}>
            <ShadowBottom imageSource={currentTheme.shadowBottom} />
            <this.Background useImageBackground={true}>
               <View style={styles.contentContainer}>
                  {this.props.showBackButton && (
                     <Appbar.BackAction
                        color={currentTheme.colors.text2}
                        onPress={() =>
                           this.props.onBackPress != null ? this.props.onBackPress() : goBack()
                        }
                        style={{ marginRight: 25 }}
                     />
                  )}
                  <View style={{ flex: 1 }}>
                     <Text style={styles.titleText}>{this.props.title}</Text>
                  </View>
                  {this.props.children}
               </View>
            </this.Background>
         </View>
      );
   }

   Background(props: { children?: JSX.Element; useImageBackground: boolean }): JSX.Element {
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
}

const styles: Styles = StyleSheet.create({
   mainContainer: {
      position: "relative",
      width: "100%",
      height: 85
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

// tslint:disable-next-line: ban-ts-ignore-except-imports
// @ts-ignore
export default withNavigation(withTheme(AppBarHeader));
