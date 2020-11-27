import React, { Component } from "react";
import { StyleSheet } from "react-native";
import { Styles } from "../../../common-tools/ts-tools/Styles";
import { List, Text } from "react-native-paper";
import { currentTheme } from "../../../config";
import { ItemProps } from "react-native-paper/typings/components/List";

class ListItemImproved extends Component<ItemProps> {
   render(): JSX.Element {
      return (
         <List.Item
            {...this.props}
            description={
               typeof this.props.description === "string" ? (
                  <Text style={styles.descriptionText}>{this.props.description}</Text>
               ) : (
                  this.props.description
               )
            }
            style={[this.props.disabled && { opacity: 0.5 }, this.props.style]}
         />
      );
   }
}

const styles: Styles = StyleSheet.create({
   descriptionText: {
      fontFamily: currentTheme.font.light,
      fontSize: 13
   }
});

export default ListItemImproved;
