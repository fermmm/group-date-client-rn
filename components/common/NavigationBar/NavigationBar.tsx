import React, { Component } from "react";
import { StyleSheet, Dimensions, StatusBar, View, ImageBackground } from "react-native";
import { TabView, SceneMap, TabBar, Route } from "react-native-tab-view";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { Styles } from "../../../common-tools/ts-tools/Styles";
import { ThemeExt, Themed } from "../../../common-tools/themes/types/Themed";
import { withTheme } from "react-native-paper";
import { currentTheme } from '../../../config';
import color from 'color';

interface NavBarProps extends Themed {
   sections: { [key: string]: () => JSX.Element };
   routes: Route[];
}

interface NavBarState {
   index: number;
}

class NavigationBar extends Component<NavBarProps, NavBarState> {
   state: NavBarState = {
      index: 0,
   };

   render(): JSX.Element {
      const { routes }: NavBarProps = this.props;
      const { colors }: ThemeExt = this.props.theme as unknown as ThemeExt;
      const { index }: NavBarState = this.state;

      return (
         <TabView
            swipeEnabled={false}
            navigationState={{ index, routes }}
            renderScene={SceneMap(this.props.sections)}
            onIndexChange={i => this.setState({ index: i })}
            initialLayout={{ width: Dimensions.get("window").width }}
            renderTabBar={props =>
               <this.Background useImageBackground={true}>
                  <TabBar
                     {...props}
                     indicatorStyle={{ backgroundColor: colors.primary2 }}
                     style={[styles.tabBar]}
                     renderIcon={({ route, focused }) =>
                     <Icon
                        name={route.icon}
                        color={focused ? colors.textLogin : colors.text2}
                        size={22}
                     />
                  }
                  />
               </this.Background>
            }
         />
      );
   }

   Background(props: { children?: JSX.Element, useImageBackground: boolean }): JSX.Element {
      if (props.useImageBackground) {
         return (
            <ImageBackground source={currentTheme.backgroundImage} style={styles.backgroundImage}>
               {props.children}
            </ImageBackground>
         );
      } else {
         return (
            <View style={styles.backgroundSolidColor}>
               {props.children}
            </View>
         );
      }
   }
}

const styles: Styles = StyleSheet.create({
   tabBar: {
      paddingTop: StatusBar.currentHeight,
      backgroundColor: color("black").alpha(0).string()
   },
   backgroundSolidColor: {
      backgroundColor: currentTheme.colors.topBar
   },
   backgroundImage: {
   }
});

export default withTheme(NavigationBar);
