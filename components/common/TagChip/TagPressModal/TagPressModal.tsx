import React, { FC } from "react";
import { View, StyleSheet } from "react-native";
import { Button } from "react-native-paper";
import { Tag } from "../../../../api/server/shared-tools/endpoints-interfaces/tags";
import { useTheme } from "../../../../common-tools/themes/useTheme/useTheme";
import { Styles } from "../../../../common-tools/ts-tools/Styles";
import { currentTheme } from "../../../../config";
import { ModalTransparent } from "../../ModalTransparent/ModalTransparent";
import TagChip from "../TagChip";

interface TagPressModalProps {
   tag: Tag;
   onClose: () => void;
}

export const TagPressModal: FC<TagPressModalProps> = ({ tag, onClose }) => {
   const { colors } = useTheme();

   const handleSubscribePress = () => {
      onClose();
   };
   const handleNavigatePress = () => {
      onClose();
   };
   const handleHidePress = () => {
      onClose();
   };

   return (
      <ModalTransparent onClose={onClose}>
         <View style={styles.mainContainer}>
            <View style={styles.tagContainer}>
               <TagChip tag={tag} interactive={false} showSubscribersAmount />
            </View>
            <Button
               mode="text"
               compact
               uppercase={false}
               color={colors.text}
               style={styles.button}
               onPress={handleSubscribePress}
            >
               Suscribirme
            </Button>
            <Button
               mode="text"
               compact
               uppercase={false}
               color={colors.text}
               style={styles.button}
               onPress={handleNavigatePress}
            >
               Navegar subscriptores
            </Button>
            <Button
               mode="text"
               compact
               uppercase={false}
               color={colors.text}
               style={styles.button}
               onPress={handleHidePress}
            >
               Ocultar subscriptores
            </Button>
         </View>
      </ModalTransparent>
   );
};

const styles: Styles = StyleSheet.create({
   mainContainer: {
      width: "90%",
      backgroundColor: currentTheme.colors.background,
      borderRadius: currentTheme.roundnessSmall,
      paddingBottom: 25
   },
   tagContainer: {
      alignItems: "center",
      justifyContent: "center",
      paddingTop: 25,
      paddingBottom: 25
   }
});
