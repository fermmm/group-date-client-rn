import React, { Component } from "react";
import { StyleSheet, View } from "react-native";
import { Styles } from "../../../common-tools/ts-tools/Styles";
import ProfileCard from "../../common/ProfileCard/ProfileCard";
import { withTheme } from "react-native-paper";
import { ThemeExt, Themed } from "../../../common-tools/themes/types/Themed";
import { getAvaiableCards } from "../../../api/cards-game";
import { User } from "../../../api/typings/User";
import NoMoreUsersMessage from "./NoMoreUsersMessage/NoMoreUsersMessage";
import CardsOptimization from "../../common/CardsEffect/CardsOptimization";
import CardAnimator from "../../common/CardsEffect/CardAnimator/CardAnimator";
import { LikeAnimation } from "../../common/CardsEffect/CardAnimator/animations/LikeAnimation";
import { DislikeAnimation } from "../../common/CardsEffect/CardAnimator/animations/DislikeAnimation";
import { BackCardSlowAnimation } from "../../common/CardsEffect/CardAnimator/animations/BackCardSlow";
import { BackCardFastAnimation } from "../../common/CardsEffect/CardAnimator/animations/BackCardFast";

export interface CardsPageProps extends Themed { }
export interface CardsPageState {
   users: User[];
   currentUser: number;
   animating: boolean;
   noMoreUsersOnServer: boolean;
}

class CardsPage extends Component<CardsPageProps, CardsPageState> {
   // tslint:disable-next-line: no-any
   animRefs: any[] = [];
   state: CardsPageState = {
      users: getAvaiableCards(),
      currentUser: 0,
      animating: false,
      noMoreUsersOnServer: false
      // noMoreUsersOnServer: true     // Uncomment this line to test the "no more users" UI
   };
   
   render(): JSX.Element {
      const { colors }: ThemeExt = this.props.theme as unknown as ThemeExt;
      const {
         users,
         currentUser,
         noMoreUsersOnServer,
      }: Partial<CardsPageState> = this.state;
      
      return (
         <View style={[styles.mainContainer, { backgroundColor: colors.background }]}>
            {
               noMoreUsersOnServer ?
                  <NoMoreUsersMessage />
               :
                  <CardsOptimization currentCard={currentUser}>
                     { 
                        users.map((user, i) =>
                           <CardAnimator
                              ref={component => this.animRefs[i] = component}
                              key={user.id}
                           >
                              <ProfileCard
                                 user={user}
                                 showLikeDislikeButtons={true}
                                 onLikeClick={() => this.onLikeOrDislike(true)}
                                 onDislikeClick={() => this.onLikeOrDislike(false)}
                              />
                           </CardAnimator>
                        )
                     }
                  </CardsOptimization>
            }
         </View>
      );
   }

   async onLikeOrDislike(liked: boolean): Promise<void> {
      const { currentUser, animating }: Partial<CardsPageState> = this.state;
      
      if (animating) {
         return;
      }

      // This animation flips the current card so the one behind is revealed (if present)
      await this.animateCards(liked);

      if (this.thereIsANextCard()) {
         // If present this loads the next card and renders it hidden behind the current one
         this.setState({ currentUser: currentUser + 1 });
      } else {
         // Here show a loading indicator and request new cards, if there are no new cards execute this:
         this.setState({ noMoreUsersOnServer: true });
      }
   }

   async animateCards(liked: boolean): Promise<void> {
      return new Promise((resolve, reject) => {
         const { users, currentUser }: Partial<CardsPageState> = this.state;

         this.setState({animating: true});
         let finishedAnimationsAmmount: number = 0;
         const totalAnimationsToPlay: number = currentUser + 1 < users.length ? 2 : 1;
   
         this.animRefs[currentUser].animate(
            liked ? new LikeAnimation() : new DislikeAnimation(), 
            () => {
               finishedAnimationsAmmount++;
               if (finishedAnimationsAmmount === totalAnimationsToPlay) {
                  this.setState({ animating: false });
                  resolve();
               }
            }
         );
         if (currentUser + 1 < users.length) {
            this.animRefs[currentUser + 1].animate(
               liked ? new BackCardSlowAnimation() : new BackCardFastAnimation(),
               () => {
                  finishedAnimationsAmmount++;
                  if (finishedAnimationsAmmount === totalAnimationsToPlay) {
                     this.setState({ animating: false });
                     resolve();
                  }
               }
            );
         }   
      });
   }

   thereIsANextCard(): boolean {
      return (this.state.currentUser + 1 < this.state.users.length);
   }
}

const styles: Styles = StyleSheet.create({
   mainContainer: {
      flex: 1,
      padding: 0,
   },
});

export default withTheme(CardsPage);
