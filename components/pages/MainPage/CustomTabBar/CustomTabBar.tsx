import React, { FC } from "react";
import { ImageBackground, View, StyleSheet, StatusBar } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { MaterialTopTabBarProps } from "@react-navigation/material-top-tabs";
import GraphSvg2 from "../../../../assets/GraphSvg2";
import { useTheme } from "../../../../common-tools/themes/useTheme/useTheme";
import ShadowBottom from "../../../common/ShadowBottom/ShadowBottom";
import BadgeExtended from "../../../common/BadgeExtended/BadgeExtended";
import { currentTheme } from "../../../../config";
import { Styles } from "../../../../common-tools/ts-tools/Styles";
import { ViewTouchable } from "../../../common/ViewTouchable/ViewTouchable";

const CustomTabBar: FC<MaterialTopTabBarProps & { badgeNumbers: Record<string, number> }> = ({
   state,
   descriptors,
   navigation,
   position,
   badgeNumbers
}) => {
   const theme = useTheme();

   return (
      <View>
         <ShadowBottom imageSource={theme.shadowBottom} />
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
                              circleColor={isFocused ? theme.colors.primary2 : theme.colors.text2}
                              lineColor={isFocused ? theme.colors.primary2 : theme.colors.text2}
                              style={{
                                 width: 23,
                                 marginBottom: 5
                              }}
                           />
                        );
                        break;
                     case "Tags":
                        icon = "pound";
                        break;
                     case "Settings":
                        icon = "account-settings";
                        break;
                  }

                  return (
                     <ViewTouchable
                        onPress={onPress}
                        defaultRippleColor={theme.colors.primary2}
                        style={[styles.buttonContainer, isFocused ? styles.focusedButton : {}]}
                        key={route.key}
                     >
                        <>
                           {typeof icon === "string" ? (
                              <Icon
                                 name={icon}
                                 color={isFocused ? theme.colors.primary2 : theme.colors.text2}
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
                        </>
                     </ViewTouchable>
                  );
               })}
            </View>
         </Background>
      </View>
   );
};

const Background = (props: {
   children?: React.ReactNode;
   useImageBackground: boolean;
}): JSX.Element => {
   if (props.useImageBackground) {
      return (
         <ImageBackground source={currentTheme.backgroundImage} style={styles.backgroundImage}>
            {props.children}
         </ImageBackground>
      );
   } else {
      return <View style={styles.backgroundSolidColor}>{props.children}</View>;
   }
};

export default CustomTabBar;

const styles: Styles = StyleSheet.create({
   tabBar: {
      flexDirection: "row",
      height: 75,
      paddingTop: StatusBar.currentHeight,
      zIndex: 1
   },
   buttonContainer: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      borderBottomColor: "red",
      borderRadius: 0
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
