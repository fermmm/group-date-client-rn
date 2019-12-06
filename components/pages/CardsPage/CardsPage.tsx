import React, { Component } from "react";
import { StyleSheet, View } from "react-native";
import { Styles } from "../../../common-tools/ts-tools/Styles";
import ProfileCard from "../../common/ProfileCard/ProfileCard";
import { withTheme } from "react-native-paper";
import { ThemeExt, Themed } from "../../../common-tools/themes/types/Themed";
import { getAvaiableCards } from "../../../server-api/cards-game";
import { User } from "../../../server-api/typings/User";
import NoMoreUsersMessage from "./NoMoreUsersMessage/NoMoreUsersMessage";
import CardsOptimization from "../../common/CardsEffect/CardsOptimization";
import LikeDislikeAnimation from "../../common/CardsEffect/LikeDislikeAnimation/LikeDislikeAnimation";
import { LikeAnimation } from "../../common/CardsEffect/LikeDislikeAnimation/animations/LikeAnimation";
import { DislikeAnimation } from "../../common/CardsEffect/LikeDislikeAnimation/animations/DislikeAnimation";
import { BackCardSlowAnimation } from '../../common/CardsEffect/LikeDislikeAnimation/animations/BackCardSlow';
import { BackCardFastAnimation } from '../../common/CardsEffect/LikeDislikeAnimation/animations/BackCardFast';

export interface CardsPageProps extends Themed { }
export interface CardsPageState {
   users: User[];
   currentUser: number;
   animating: boolean;
   noMoreUsersOnServer: boolean;
}

class CardsPage extends Component<CardsPageProps, CardsPageState> {
   state: CardsPageState = {
      users: getAvaiableCards(),
      currentUser: 0,
      animating: false,
      noMoreUsersOnServer: false
      // noMoreUsersOnServer: true     // Uncomment this line to test the "no more users" UI
   };

   // tslint:disable-next-line: no-any
   animRefs: any[] = [];

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
                           <LikeDislikeAnimation
                              ref={component => this.animRefs[i] = component}
                              key={user.id}
                           >
                              <ProfileCard
                                 user={user}
                                 showLikeDislikeButtons={true}
                                 onLikeClick={() => this.onLikeOrDislike(true)}
                                 onDislikeClick={() => this.onLikeOrDislike(false)}
                              />
                           </LikeDislikeAnimation>
                        )
                     }
                  </CardsOptimization>
            }
         </View>
      );
   }

   onLikeOrDislike(liked: boolean): void {
      const { users, currentUser, animating }: Partial<CardsPageState> = this.state;

      if (animating) {
         return;
      }

      this.setState({animating: true});
      this.animRefs[currentUser].animate(
         liked ? new LikeAnimation() : new DislikeAnimation(), 
         () => this.onAnimationFinish()
      );
      if (currentUser + 1 < users.length) {
         this.animRefs[currentUser + 1].animate(
            liked ? new BackCardSlowAnimation() : new BackCardFastAnimation()
         );
      }
   }

   onAnimationFinish(): void {
      const { users, currentUser }: Partial<CardsPageState> = this.state;

      this.setState({ animating: false });
      
      if (currentUser + 1 < users.length) {
         this.setState({ currentUser: currentUser + 1 });
      }

      if (currentUser === users.length - 1) {
         this.onNoMoreUsersOnMemory();
      }
   }

   onNoMoreUsersOnMemory(): void {
      // Here request more users to the server and if the response is that there are no more users call this:
      this.setState({ noMoreUsersOnServer: true });
   }
}

const styles: Styles = StyleSheet.create({
   mainContainer: {
      flex: 1,
      padding: 0,
   },
});

export default withTheme(CardsPage);
