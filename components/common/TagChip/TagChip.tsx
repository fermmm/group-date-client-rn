import React, { FC, memo, useState } from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { Styles } from "../../../common-tools/ts-tools/Styles";
import { Caption, Text } from "react-native-paper";
import { ThemeExt } from "../../../common-tools/themes/types/Themed";
import color from "color";
import { useTheme } from "../../../common-tools/themes/useTheme/useTheme";
import { currentTheme } from "../../../config";
import { Tag } from "../../../api/server/shared-tools/endpoints-interfaces/tags";
import { ViewTouchable } from "../ViewTouchable/ViewTouchable";
import { TagPressModal } from "./TagPressModal/TagPressModal";

export interface PropsTagChip {
   tag: Tag;
   hideCategory?: boolean;
   showSubscribersAmount?: boolean;
   interactive?: boolean;
   style?: StyleProp<ViewStyle>;
}

const TagChip: FC<PropsTagChip> = ({
   tag,
   hideCategory,
   showSubscribersAmount,
   interactive = true,
   style
}) => {
   const { colors }: ThemeExt = useTheme();
   const [showModal, setShowModal] = useState(false);
   const userHasTag: boolean = true; // Implement compare logic here

   return (
      <>
         <ViewTouchable onPress={interactive ? () => setShowModal(true) : null}>
            <View
               style={[
                  styles.mainContainer,
                  {
                     backgroundColor: color(colors.background).darken(0.05).string(),
                     borderColor: !userHasTag && color(colors.statusBad).alpha(0.6).string()
                  },
                  !userHasTag && styles.border,
                  style
               ]}
            >
               <>
                  <View>
                     {!hideCategory && (
                        <Caption style={styles.categoryText}>{tag.category}</Caption>
                     )}
                     <Text style={styles.nameText}>{tag.name}</Text>
                  </View>
                  {showSubscribersAmount && (
                     <Text style={styles.subscribersText}>+{tag.subscribersAmount ?? 0}</Text>
                  )}
               </>
            </View>
         </ViewTouchable>
         {showModal && <TagPressModal tag={tag} onClose={() => setShowModal(false)} />}
      </>
   );
};
const styles: Styles = StyleSheet.create({
   mainContainer: {
      alignSelf: "flex-start",
      flexDirection: "row",
      alignItems: "center",
      padding: 10,
      paddingLeft: 17,
      paddingRight: 17,
      marginRight: 5,
      marginBottom: 5,
      borderRadius: currentTheme.roundness
   },
   border: {
      borderBottomWidth: 1
   },
   categoryText: {
      color: currentTheme.colors.text,
      fontSize: 10,
      marginBottom: 0
   },
   nameText: {
      color: currentTheme.colors.text
   },
   subscribersText: {
      fontSize: 10,
      marginLeft: 20
   }
});

export default memo(TagChip);
