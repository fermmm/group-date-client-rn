import React, { useState, FC } from "react";
import { StyleSheet, Dimensions, StatusBar, View, ImageBackground } from "react-native";
import { TabView, SceneMap, TabBar, Route } from "react-native-tab-view";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { Styles } from "../../../common-tools/ts-tools/Styles";
import { currentTheme } from "../../../config";
import color from "color";
import ShadowBottom from "../ShadowBottom/ShadowBottom";
import BadgeExtended from "../BadgeExtended/BadgeExtended";
import { Scene } from "react-native-tab-view/lib/typescript/src/types";
import { useTheme } from "../../../common-tools/themes/useTheme/useTheme";

interface NavBarProps {
   sections: { [key: string]: () => JSX.Element };
   routes: RouteExtended[];
}

export const NavigationBar: FC<NavBarProps> = props => {
   const [index, setIndex] = useState<number>(0);
   const theme = useTheme();

   const { routes }: NavBarProps = props;

   return (
      <TabView
         swipeEnabled={false}
         navigationState={{
            index,
            routes
         }}
         renderScene={SceneMap(props.sections)}
         onIndexChange={setIndex}
         initialLayout={{
            height: 0,
            width: Dimensions.get("window").width
         }}
         renderTabBar={tabBarProps => (
            <View>
               <ShadowBottom
                  imageSource={theme.shadowBottom}
                  style={{
                     opacity: index === 0 ? 0.35 : 1
                  }}
               />
               <Background useImageBackground={true}>
                  <TabBar
                     {...tabBarProps}
                     indicatorStyle={{
                        backgroundColor: theme.colors.primary2
                     }}
                     style={[styles.tabBar]}
                     renderIcon={(scene: Scene<RouteExtended>) => (
                        <View>
                           {typeof scene.route.iconNameOrComp === "string" ? (
                              <Icon
                                 name={scene.route.iconNameOrComp}
                                 color={theme.colors.text2}
                                 size={22}
                              />
                           ) : (
                              scene.route.iconNameOrComp
                           )}
                           {scene.route.badgeNumber && (
                              <BadgeExtended
                                 amount={scene.route.badgeNumber}
                                 size={20}
                                 extraX={-8}
                                 extraY={-6}
                              />
                           )}
                        </View>
                     )}
                  />
               </Background>
            </View>
         )}
      />
   );
};

function Background(props: {
   children?: React.ReactNode;
   useImageBackground: boolean;
}): JSX.Element {
   const theme = useTheme();

   if (props.useImageBackground) {
      return (
         <ImageBackground source={theme.backgroundImage} style={styles.backgroundImage}>
            {props.children}
         </ImageBackground>
      );
   } else {
      return <View style={styles.backgroundSolidColor}>{props.children}</View>;
   }
}

const styles: Styles = StyleSheet.create({
   tabBar: {
      paddingTop: StatusBar.currentHeight,
      backgroundColor: color("black").alpha(0).string(),
      zIndex: 1
   },
   backgroundSolidColor: {
      backgroundColor: currentTheme.colors.backgroundBottomGradient
   },
   backgroundImage: {}
});

export type RouteExtended = Route & {
   badgeNumber?: number;
   iconNameOrComp: string | React.ReactNode;
};
