import React, { Component } from "react";
import { StyleSheet } from "react-native";
import { withTheme, Appbar } from "react-native-paper";
import { Themed, ThemeExt } from "../../../common-tools/themes/types/Themed";
import { Styles } from "../../../common-tools/ts-tools/Styles";
import { withNavigation, NavigationInjectedProps, NavigationScreenProp } from "react-navigation";
import { currentTheme } from "../../../config";

export interface AppBarHeaderProps extends Themed, NavigationInjectedProps {
   title?: string;
   subtitle?: string;
   showMenuIcon?: boolean;
   showBackButton?: boolean;
   onBackPress?(): void;
}
export interface AppBarHeaderState { }

class AppBarHeader extends Component<AppBarHeaderProps, AppBarHeaderState> {
   static defaultProps: Partial<AppBarHeaderProps> = {
      title: "",
      subtitle: "",
      showMenuIcon: false,
      showBackButton: true,
   };

   render(): JSX.Element {
      const { colors }: ThemeExt = this.props.theme as unknown as ThemeExt;
      const { goBack }: NavigationScreenProp<{}> = this.props.navigation;

      return (
         <Appbar.Header dark={true} style={styles.mainContainer}>
            {
               this.props.showBackButton &&
                  <Appbar.BackAction
                     onPress={this.props.onBackPress != null ? () => this.props.onBackPress() : () => goBack()}
                  />
            }
            <Appbar.Content
               title={this.props.title}
               subtitle={this.props.subtitle}
            />
            {this.props.children}
            {
               this.props.showMenuIcon &&
               <Appbar.Action icon="more-vert" />
            }
         </Appbar.Header>
      );
   }
}

const styles: Styles = StyleSheet.create({
   mainContainer: {
      paddingRight: 15,
      paddingLeft: 15,
      backgroundColor: currentTheme.colors.primary
   }
});

export default withNavigation(withTheme(AppBarHeader));
