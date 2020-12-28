import React, { FC } from "react";
import { StyleSheet } from "react-native";
import { Styles } from "../../../common-tools/ts-tools/Styles";
import { List, Text } from "react-native-paper";
import { currentTheme } from "../../../config";

const ListItemImproved: FC<React.ComponentProps<typeof List.Item>> = props => {
   return (
      <List.Item
         {...props}
         description={
            typeof props.description === "string" ? (
               <Text style={styles.descriptionText}>{props.description}</Text>
            ) : (
               props.description
            )
         }
         style={[props.disabled && { opacity: 0.5 }, props.style]}
      />
   );
};

const styles: Styles = StyleSheet.create({
   descriptionText: {
      fontFamily: currentTheme.font.light,
      fontSize: 13
   }
});

export default ListItemImproved;
