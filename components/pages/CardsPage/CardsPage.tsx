import React, { Component } from "react";
import { StyleSheet, View } from "react-native";
import { Styles } from "../../../common-tools/ts-tools/Styles";
import ProfileCard from "../../common/ProfileCard/ProfileCard";
import { withTheme } from "react-native-paper";
import { ThemeExt, Themed } from "../../../common-tools/themes/types/Themed";
import { getAvaiableCards } from "../../../server-api/cards-game";
import { User } from "../../../server-api/typings/User";
import NoMoreUsersMessage from "./NoMoreUsersMessage/NoMoreUsersMessage";
import CardsEffect from "../../common/CardsEffect/CardsEffect";

export interface CardsPageProps extends Themed { }
export interface CardsPageState {
   users: User[];
   currentUser: number;
   lastUserWasLiked: boolean;
   noMoreUsersOnServer: boolean;
}

class CardsPage extends Component<CardsPageProps, CardsPageState> {
   state: CardsPageState = { 
      users: getAvaiableCards(),
      currentUser: 0,
      lastUserWasLiked: false,
      noMoreUsersOnServer: false
      // noMoreUsersOnServer: true     // Uncomment this line to test the "no more users" UI
   };

   render(): JSX.Element {
      const { colors }: ThemeExt = this.props.theme as unknown as ThemeExt;
      const { 
         users, 
         currentUser, 
         lastUserWasLiked, 
         noMoreUsersOnServer
      }: Partial<CardsPageState> = this.state;

      return (
         <View style={[styles.mainContainer, { backgroundColor: colors.background }]}>
            {
               noMoreUsersOnServer ?
                  <NoMoreUsersMessage />
               :
                  <CardsEffect 
                     currentCard={currentUser}
                     lastCardWasLiked={lastUserWasLiked}
                  >
                     {
                        users.map((user) => 
                           <ProfileCard
                              user={user}
                              showLikeDislikeButtons={true}
                              onLikeClick={() => this.onLikeOrDislike(true)}
                              onDislikeClick={() => this.onLikeOrDislike(false)}
                              key={user.id}
                           />
                        )
                     }
                  </CardsEffect>
            }
         </View>
      );
   }

   onLikeOrDislike(liked: boolean): void {
      const { users, currentUser }: Partial<CardsPageState> = this.state;
      if (currentUser + 1 < users.length) {
         this.setState({currentUser: currentUser + 1, lastUserWasLiked: liked});
      } else {
         this.onNoMoreUsersOnMemory();
      }
   }

   onNoMoreUsersOnMemory(): void {
      // Here request more users to the server and if the response is that there are no more users call this:
      this.setState({noMoreUsersOnServer: true});
   }
}

const styles: Styles = StyleSheet.create({
   mainContainer: {
      flex: 1,
      padding: 0,
   },
});

export default withTheme(CardsPage);
