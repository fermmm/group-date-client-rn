import React, { Component } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Styles } from "./ts-tools/Styles";

export default class App extends Component {
  render(): JSX.Element {
    return (
      <View style={styles.container}>
        <Text>Open up App.js to start working on your app!</Text>
      </View>
    );
  }
}

const styles: Styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
