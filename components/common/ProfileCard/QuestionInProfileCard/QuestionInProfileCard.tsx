import React, { FC } from "react";
import { StyleSheet, View } from "react-native";
import { Styles } from "../../../../common-tools/ts-tools/Styles";
import { Caption, Text } from "react-native-paper";
import { ThemeExt } from "../../../../common-tools/themes/types/Themed";
import color from "color";
import { useTheme } from "../../../../common-tools/themes/useTheme/useTheme";
import { currentTheme } from "../../../../config";
import { Tag } from "../../../../api/server/shared-tools/endpoints-interfaces/tags";

export interface PropsTagChip {
   tag: Tag;
   showCategory?: boolean;
}

const TagChip: FC<PropsTagChip> = ({ tag, showCategory }) => {
   const { colors }: ThemeExt = useTheme();
   const answerMatches: boolean = true; // Implement compare logic here

   return (
      <View
         style={[
            styles.mainContainer,
            {
               backgroundColor: color(colors.background).darken(0.05).string(),
               borderColor: !answerMatches && color(colors.statusBad).alpha(0.6).string()
            },
            !answerMatches && styles.border
         ]}
      >
         {showCategory && (
            <Text
               style={{
                  color: colors.text
               }}
            >
               {tag.category}
            </Text>
         )}
         <Caption
            style={{
               color: colors.text
            }}
         >
            {tag.name}
         </Caption>
      </View>
   );
};
const styles: Styles = StyleSheet.create({
   mainContainer: {
      alignSelf: "flex-start",
      padding: 10,
      paddingLeft: 17,
      paddingRight: 17,
      marginRight: 5,
      marginBottom: 5,
      borderRadius: currentTheme.roundness
   },
   border: {
      borderBottomWidth: 1
   }
});

export default TagChip;
