import React, { Component } from "react";
import { StyleSheet, View } from "react-native";
import { Styles } from "../../../common-tools/ts-tools/Styles";
import ProfileCard from "../../common/ProfileCard/ProfileCard";
import { withTheme } from "react-native-paper";
import { ThemeExt, Themed } from "../../../common-tools/themes/types/Themed";
import { getAvaiableCards } from "../../../server-api/cards-game";
import { User } from "../../../server-api/typings/User";
import NoMoreUsersMessage from "./NoMoreUsersMessage/NoMoreUsersMessage";

export interface CardsPageProps extends Themed { }
export interface CardsPageState {
   users: User[];
}

class CardsPage extends Component<CardsPageProps, CardsPageState> {
   state: CardsPageState = {
      // users: []      // Uncomment this line to test the "no more users" UI
      users: getAvaiableCards()
   };

   render(): JSX.Element {
      const { colors }: ThemeExt = this.props.theme as unknown as ThemeExt;
      const { users }: Partial<CardsPageState> = this.state;

      return (
         <View style={[styles.mainContainer, { backgroundColor: colors.background }]}>
            {
               users.length === 0 ?
                  <NoMoreUsersMessage />
               :
                  <ProfileCard
                     user={users[0]}
                     showLikeDislikeButtons={true}
                     onLikeClick={() => console.log("Like clicked")}
                     onDislikeClick={() => console.log("Dislike clicked")}
                  />
            }
         </View>
      );
   }
}

const styles: Styles = StyleSheet.create({
   mainContainer: {
      flex: 1,
      padding: 0,
   },
});

export default withTheme(CardsPage);
