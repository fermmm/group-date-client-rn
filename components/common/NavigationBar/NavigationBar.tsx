import React, { FC, useState } from "react";
import {
   Dimensions,
   ImageBackground,
   StatusBar,
   TouchableOpacity,
   View,
   StyleSheet
} from "react-native";
import CardsPage from "../../pages/CardsPage/CardsPage";
import GroupsListPage from "../../pages/GroupsListPage/GroupsListPage";
import NotificationsPage from "../../pages/NotificationsPage/NotificationsPage";
import SettingsPage from "../../pages/SettingsPage/SettingsPage";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import {
   createMaterialTopTabNavigator,
   MaterialTopTabBarProps
} from "@react-navigation/material-top-tabs";
import { Styles } from "../../../common-tools/ts-tools/Styles";
import { currentTheme } from "../../../config";
import GraphSvg2 from "../../../assets/GraphSvg2";
import ShadowBottom from "../ShadowBottom/ShadowBottom";
import BadgeExtended from "../BadgeExtended/BadgeExtended";

const Tab = createMaterialTopTabNavigator();

const NavigationBar: FC = () => {
   const [badgeNumbers] = useState<Record<string, number>>({
      Cards: 0,
      Notifications: 2,
      Groups: 0,
      Settings: 4
   });

   return (
      <Tab.Navigator
         initialRouteName={"Cards"}
         swipeEnabled={false}
         initialLayout={{
            height: 0,
            width: Dimensions.get("window").width
         }}
         tabBar={props => <CustomTabBar {...props} badgeNumbers={badgeNumbers} />}
      >
         <Tab.Screen name="Cards" component={CardsPage} />
         <Tab.Screen name="Groups" component={GroupsListPage} />
         <Tab.Screen name="Notifications" component={NotificationsPage} />
         <Tab.Screen name="Settings" component={SettingsPage} />
      </Tab.Navigator>
   );
};

function CustomTabBar({
   state,
   descriptors,
   navigation,
   position,
   badgeNumbers
}: MaterialTopTabBarProps & { badgeNumbers: Record<string, number> }) {
   return (
      <View>
         <ShadowBottom
            imageSource={currentTheme.shadowBottom}
            style={{
               opacity: state.index === 0 ? 0.35 : 1
            }}
         />
         <Background useImageBackground={true}>
            <View style={styles.tabBar}>
               {state.routes.map((route, index) => {
                  const isFocused = state.index === index;

                  const onPress = () => {
                     const event = navigation.emit({
                        type: "tabPress",
                        target: route.key,
                        canPreventDefault: true
                     });

                     if (!isFocused && !event.defaultPrevented) {
                        navigation.navigate(route.name);
                     }
                  };

                  let icon: React.ReactNode;

                  switch (route.name) {
                     case "Cards":
                        icon = "cards";
                        break;
                     case "Notifications":
                        icon = "bell";
                        break;
                     case "Groups":
                        icon = (
                           <GraphSvg2
                              circleColor={
                                 isFocused
                                    ? currentTheme.colors.primary2
                                    : currentTheme.colors.text2
                              }
                              lineColor={
                                 isFocused
                                    ? currentTheme.colors.primary2
                                    : currentTheme.colors.text2
                              }
                              style={{
                                 width: 23,
                                 marginBottom: 5
                              }}
                           />
                        );
                        break;
                     case "Settings":
                        icon = "account-settings";
                        break;
                  }

                  return (
                     <TouchableOpacity
                        onPress={onPress}
                        style={[styles.buttonContainer, isFocused ? styles.focusedButton : {}]}
                        key={route.key}
                     >
                        {typeof icon === "string" ? (
                           <Icon
                              name={icon}
                              color={
                                 isFocused
                                    ? currentTheme.colors.primary2
                                    : currentTheme.colors.text2
                              }
                              size={24}
                           />
                        ) : (
                           icon
                        )}
                        {badgeNumbers[route.name] !== 0 && (
                           <BadgeExtended
                              amount={badgeNumbers[route.name]}
                              size={20}
                              extraX={54}
                              extraY={10}
                           />
                        )}
                     </TouchableOpacity>
                  );
               })}
            </View>
         </Background>
      </View>
   );
}

function Background(props: {
   children?: React.ReactNode;
   useImageBackground: boolean;
}): JSX.Element {
   if (props.useImageBackground) {
      return (
         <ImageBackground source={currentTheme.backgroundImage} style={styles.backgroundImage}>
            {props.children}
         </ImageBackground>
      );
   } else {
      return <View style={styles.backgroundSolidColor}>{props.children}</View>;
   }
}

const styles: Styles = StyleSheet.create({
   tabBar: {
      flexDirection: "row",
      height: 80,
      paddingTop: StatusBar.currentHeight,
      zIndex: 1
   },
   buttonContainer: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      borderBottomColor: "red"
   },
   focusedButton: {
      borderBottomWidth: 3,
      borderBottomColor: currentTheme.colors.primary2
   },
   backgroundSolidColor: {
      backgroundColor: currentTheme.colors.backgroundBottomGradient
   },
   backgroundImage: {}
});

export default NavigationBar;
