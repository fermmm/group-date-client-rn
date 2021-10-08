import React, { FC, memo, useMemo } from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { Styles } from "../../../common-tools/ts-tools/Styles";
import { Caption, Text } from "react-native-paper";
import { ThemeExt } from "../../../common-tools/themes/types/Themed";
import color from "color";
import { useTheme } from "../../../common-tools/themes/useTheme/useTheme";
import { currentTheme } from "../../../config";
import { Tag } from "../../../api/server/shared-tools/endpoints-interfaces/tags";
import { ViewTouchable } from "../ViewTouchable/ViewTouchable";
import { toFirstUpperCase } from "../../../common-tools/js-tools/js-tools";

export interface PropsTagChip {
   tag: Tag;
   interactive?: boolean;
   onPress?: (tag: Tag) => void;
   hideCategory?: boolean;
   showSubscribersAmount?: boolean;
   style?: StyleProp<ViewStyle>;
   userSubscribed?: boolean;
   userBlocked?: boolean;
   small?: boolean;
}

const TagChip: FC<PropsTagChip> = ({
   tag,
   hideCategory,
   showSubscribersAmount,
   interactive = true,
   onPress,
   userSubscribed,
   userBlocked,
   style,
   small
}) => {
   const { colors }: ThemeExt = useTheme();

   const styleBasedOnUserTags = useMemo(() => {
      let result: StyleProp<ViewStyle> = {};

      if (userSubscribed) {
         result = {
            ...result,
            borderLeftWidth: 2,
            borderColor: color(colors.accent3).string()
         };
      }

      if (userBlocked) {
         result = {
            ...result,
            borderLeftWidth: 2,
            borderColor: color(colors.statusBad).lighten(0.3).string()
         };
      }

      return result;
   }, [userBlocked, userSubscribed]);

   return (
      <>
         <ViewTouchable
            style={styles.touchableContainer}
            onPress={interactive ? () => onPress(tag) : null}
            defaultAlpha={0.1}
         >
            <View
               style={[
                  styles.mainContainer,
                  styleBasedOnUserTags,
                  style,
                  small ? styles.mainContainerSmall : {}
               ]}
            >
               <>
                  <View>
                     {!hideCategory && (
                        <Caption style={styles.categoryText}>
                           {toFirstUpperCase(tag.category)}
                        </Caption>
                     )}
                     <Text style={[styles.nameText, small ? styles.nameTextSmall : {}]}>
                        {toFirstUpperCase(tag.name)}
                     </Text>
                  </View>
                  {showSubscribersAmount && (
                     <Text style={styles.subscribersText}>+{tag.subscribersAmount ?? 0}</Text>
                  )}
               </>
            </View>
         </ViewTouchable>
      </>
   );
};
const styles: Styles = StyleSheet.create({
   touchableContainer: {
      marginBottom: 6
   },
   mainContainer: {
      alignSelf: "flex-start",
      flexDirection: "row",
      alignItems: "center",
      padding: 10,
      paddingLeft: 17,
      paddingRight: 17,
      marginRight: 5,
      borderRadius: currentTheme.roundness,
      backgroundColor: color(currentTheme.colors.background).darken(0.05).string()
   },
   mainContainerSmall: {
      padding: 8,
      paddingLeft: 14,
      paddingRight: 14,
      marginRight: 4
   },
   categoryText: {
      color: currentTheme.colors.text,
      fontSize: 10,
      marginBottom: 0
   },
   nameText: {
      color: currentTheme.colors.text
   },
   nameTextSmall: {
      fontSize: 12
   },
   subscribersText: {
      fontSize: 10,
      marginLeft: 20
   }
});

export default memo(TagChip);
