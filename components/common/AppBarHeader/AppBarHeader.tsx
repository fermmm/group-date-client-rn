import React, { Component, FunctionComponent } from "react";
import { StyleSheet, ImageBackground, View, StatusBar, Text } from "react-native";
import { withTheme, Appbar } from "react-native-paper";
import { Themed, ThemeExt } from "../../../common-tools/themes/types/Themed";
import { Styles } from "../../../common-tools/ts-tools/Styles";
import { withNavigation, NavigationInjectedProps, NavigationScreenProp } from "react-navigation";
import { currentTheme } from "../../../config";
import color from "color";

export interface AppBarHeaderProps extends Themed, NavigationInjectedProps {
   title?: string;
   showBackButton?: boolean;
   onBackPress?(): void;
}
export interface AppBarHeaderState { }

class AppBarHeader extends Component<AppBarHeaderProps, AppBarHeaderState> {
   static defaultProps: Partial<AppBarHeaderProps> = {
      title: "",
      showBackButton: true,
   };

   render(): JSX.Element {
      const { goBack }: NavigationScreenProp<{}> = this.props.navigation;

      return (
         <View style={styles.mainContainer}>
            <this.Background useImageBackground={true}>
               <View style={styles.contentContainer}>
                  {
                     this.props.showBackButton &&
                     <Appbar.BackAction
                        color={currentTheme.colors.text2}
                        onPress={() => this.props.onBackPress != null ? this.props.onBackPress() : goBack()}
                        style={{marginRight: 25}}
                     />
                  }
                  <View style={{ flex: 1 }}>
                     <Text style={styles.titleText}>
                        {this.props.title}
                     </Text>
                  </View>
                  {this.props.children}
               </View>
            </this.Background>
         </View>
      );
   }

   Background(props: { children?: JSX.Element, useImageBackground: boolean }): JSX.Element {
      if (props.useImageBackground) {
         return (
            <ImageBackground source={currentTheme.backgroundImage} style={styles.imageBackground}>
               {props.children}
            </ImageBackground>
         );
      } else {
         return (
            <View style={styles.colorBackground}>
               {props.children}
            </View>
         );
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
      paddingTop: StatusBar.currentHeight,
   },
   colorBackground: {
      flex: 1,
      width: "100%",
      justifyContent: "center",
      backgroundColor: currentTheme.colors.primary,
      paddingTop: StatusBar.currentHeight,
   },
   contentContainer: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      paddingRight: 10,
      paddingLeft: 0,
   },
   titleText: {
      color: currentTheme.colors.text2,
      fontSize: 16,
      fontFamily: currentTheme.fonts.medium,
   }
});

export default withNavigation(withTheme(AppBarHeader));
