import React, { Component } from "react";
import { StyleSheet, Dimensions, StatusBar, View, ImageBackground } from "react-native";
import { TabView, SceneMap, TabBar, Route } from "react-native-tab-view";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { Styles } from "../../../common-tools/ts-tools/Styles";
import { ThemeExt, Themed } from "../../../common-tools/themes/types/Themed";
import { withTheme } from "react-native-paper";
import { currentTheme } from "../../../config";
import color from "color";
import ShadowBottom from "../ShadowBottom/ShadowBottom";
import BadgeExtended from "../BadgeExtended/BadgeExtended";
import { Merge } from "../../../common-tools/ts-tools/common-ts-tools";

interface NavBarProps extends Themed {
   sections: { [key: string]: () => JSX.Element };
   routes: RouteExtended[];
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
                  <ShadowBottom imageSource={currentTheme.shadowBottom} style={{ opacity: index === 0 ? 0.35 : 1 }} />
                  <TabBar
                     {...props}
                     indicatorStyle={{ backgroundColor: colors.primary2 }}
                     style={[styles.tabBar]}
                     renderIcon={({ route, focused }) =>
                        <View>
                           {
                              typeof route.icon === "string" ?
                                 <Icon
                                    name={route.icon}
                                    color={colors.text2}
                                    size={22}
                                 />
                              :
                                 route.icon
                           }
                           {
                              route.badgeText && 
                                 <BadgeExtended 
                                    size={20} 
                                    extraX={-8}
                                    extraY={-6}
                                 >
                                    {route.badgeText}
                                 </BadgeExtended>
                           }
                        </View>
                     }
                  />
               </this.Background>
            }
         />
      );
   }

   Background(props: { children?: React.ReactNode, useImageBackground: boolean }): JSX.Element {
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
      backgroundColor: color("black").alpha(0).string(),
      zIndex: 1,
   },
   backgroundSolidColor: {
      backgroundColor: currentTheme.colors.backgroundBottomGradient
   },
   backgroundImage: {
   }
});

export type RouteExtended = Merge<Route, {
   badgeText?: string;
   icon: string | React.ReactNode
}>;

export default withTheme(NavigationBar);
