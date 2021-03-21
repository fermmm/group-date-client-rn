import React, { FC } from "react";
import { View, StyleSheet, Text } from "react-native";
import { Tag } from "../../../../api/server/shared-tools/endpoints-interfaces/tags";
import { Styles } from "../../../../common-tools/ts-tools/Styles";
import { currentTheme } from "../../../../config";
import { ModalTransparent } from "../../ModalTransparent/ModalTransparent";

interface TagPressModalProps {
   tag: Tag;
   onClose: () => void;
}

export const TagPressModal: FC<TagPressModalProps> = ({ tag, onClose }) => {
   return (
      <ModalTransparent onClose={() => onClose()}>
         <View style={styles.mainContainer}>
            <Text> {tag.name} </Text>
         </View>
      </ModalTransparent>
   );
};

const styles: Styles = StyleSheet.create({
   mainContainer: {
      backgroundColor: currentTheme.colors.background
   }
});
