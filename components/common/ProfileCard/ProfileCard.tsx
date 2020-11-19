import React, { Component } from "react";
import color from "color";
import {
   ImageProps,
   Image,
   StatusBar,
   StyleSheet,
   View,
   Dimensions,
   Platform,
   ImageBackground
} from "react-native";
import { Card, Paragraph, withTheme, Text, Caption } from "react-native-paper";
import ImagesScroll from "../ImagesScroll/ImagesScroll";
import ImagesModal from "../ImagesModal/ImagesModal";
import { Styles } from "../../../common-tools/ts-tools/Styles";
import { Themed, ThemeExt } from "../../../common-tools/themes/types/Themed";
import LikeDislikeButtons from "./LikeDislikeButtons/LikeDislikeButtons";
import ScrollViewExtended from "../ScrollViewExtended/ScrollViewExtended";
import QuestionInProfileCard from "./QuestionInProfileCard/QuestionInProfileCard";
import { User } from "../../../api/typings/User";
import { getAge } from "../../../api/tools/date-tools";
import EditButton from "./EditButton/EditButton";
import { withNavigation, StackScreenProps, NavigationScreenProp } from "@react-navigation/stack";
import { fakeProfileQuestionsPart } from "../../../api/tools/debug-tools/fakeProfileQuestions";
import { fakeFilterQuestions } from "../../../api/tools/debug-tools/fakeFilterQuestions";
import { QuestionData } from "../../../api/typings/endpoints-interfaces/questions";

export interface ProfileCardProps extends Themed, StackScreenProps<{}> {
   user: User;
   showLikeDislikeButtons?: boolean;
   editMode?: boolean;
   statusBarPadding?: boolean;
   onLikeClick?: () => void;
   onDislikeClick?: () => void;
}

export interface ProfileCardState {
   renderImageModal: boolean;
   imageSelected: number;
}

class ProfileCard extends Component<ProfileCardProps, ProfileCardState> {
   state: ProfileCardState = {
      renderImageModal: false,
      imageSelected: 0
   };

   render(): JSX.Element {
      const {
         showLikeDislikeButtons,
         onLikeClick,
         onDislikeClick,
         statusBarPadding,
         editMode
      }: Partial<ProfileCardProps> = this.props;
      const { name, images, birthdate, area }: Partial<User> = this.props.user;
      const { renderImageModal, imageSelected }: Partial<ProfileCardState> = this.state;
      const { colors }: ThemeExt = (this.props.theme as unknown) as ThemeExt;
      const { navigate }: StackNavigationProp<Record<string, {}>> = this.props.navigation;
      const questions: QuestionData[] = [...fakeProfileQuestionsPart, ...fakeFilterQuestions];

      return (
         <>
            <View
               style={[
                  styles.mainContainer,
                  { paddingBottom: showLikeDislikeButtons ? styles.mainContainer.paddingBottom : 0 }
               ]}
            >
               <View>
                  <ScrollViewExtended
                     style={[styles.scrollView]}
                     showBottomGradient={true}
                     bottomGradientColor={colors.background}
                     indicatorStyle={"white"}
                  >
                     <Card style={[styles.card, { backgroundColor: colors.background }]}>
                        <View>
                           <ImagesScroll
                              images={images}
                              style={[
                                 styles.galleryScroll,
                                 statusBarPadding && { marginTop: StatusBar.currentHeight }
                              ]}
                              onImageClick={(i: number) =>
                                 this.setState({ imageSelected: i, renderImageModal: true })
                              }
                              renderImage={(uri: string, imageProps: ImageProps) => (
                                 <ImageBackground
                                    style={{ width: "100%", height: "100%" }}
                                    source={{ uri }}
                                    blurRadius={Platform.OS === "ios" ? 120 : 60}
                                 >
                                    <Image
                                       {...imageProps}
                                       resizeMethod={"resize"}
                                       resizeMode={"contain"}
                                       key={uri}
                                    />
                                 </ImageBackground>
                              )}
                           />
                           {editMode && (
                              <EditButton
                                 showAtBottom
                                 label={"Cambiar Fotos"}
                                 onPress={() => navigate("ChangePictures")}
                              />
                           )}
                        </View>
                        <View style={styles.titleAreaContainer}>
                           <Card.Title
                              title={name}
                              subtitle={`${getAge(birthdate)} · ${area} · 195cm`}
                              style={{ flex: 1 }}
                              titleStyle={{ color: colors.text }}
                              subtitleStyle={{ color: colors.text }}
                           />
                           {!editMode ? (
                              <View />
                           ) : (
                              // <Text style={[styles.compatibilityPercentage, {
                              //    borderColor: color(colors.statusOk).alpha(0.5).string(),
                              //    backgroundColor: color(colors.statusOk).alpha(0.5).string(),
                              // }]}>
                              //    99%
                              // </Text>
                              <EditButton onPress={() => navigate("ChangeBasicInfo")} />
                           )}
                        </View>
                        <Card.Content>
                           <Paragraph style={[styles.descriptionParagraph, { color: colors.text }]}>
                              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                              eiusmod tempor incididunt ut labore et dolore magna aliqua.Lorem ipsum
                              dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                              incididunt ut labore et dolore magna aliqua.
                           </Paragraph>
                           {editMode && (
                              <EditButton
                                 showAtBottom
                                 absolutePosition={false}
                                 label={"Modificar texto"}
                                 onPress={() => navigate("ChangeProfileText")}
                              />
                           )}
                           <View style={styles.questionsContainer}>
                              {questions.map((question, i) => (
                                 <QuestionInProfileCard
                                    questionData={question}
                                    key={question.text}
                                 />
                              ))}
                           </View>
                           {editMode && (
                              <EditButton
                                 showAtBottom
                                 absolutePosition={false}
                                 label={"Revisar todas las preguntas"}
                                 onPress={() => navigate("ChangeQuestions")}
                              />
                           )}
                        </Card.Content>
                     </Card>
                  </ScrollViewExtended>
                  {showLikeDislikeButtons && (
                     <LikeDislikeButtons
                        style={styles.likeDislikeButtons}
                        onLikeClick={() => onLikeClick()}
                        onDislikeClick={() => onDislikeClick()}
                     />
                  )}
               </View>
            </View>
            {renderImageModal === true && (
               <ImagesModal
                  visible={renderImageModal}
                  images={images}
                  initialPage={imageSelected}
                  onClose={() => this.setState({ renderImageModal: false })}
               />
            )}
         </>
      );
   }
}

const styles: Styles = StyleSheet.create({
   mainContainer: {
      flex: 1,
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      paddingBottom: 47 // The bottom padding under the like-dislike buttons (only applied when buttons are present).
   },
   scrollView: {
      flexGrow: 0
   },
   card: {
      paddingBottom: 30 // Padding in the content when scrolled to bottom to prevent like-dislike buttons from covering text. (Only applied if the like-dislike buttons are visible).
   },
   galleryScroll: {
      height: Dimensions.get("window").height * 0.5 // This controls the height of the images area.
   },
   titleAreaContainer: {
      flexDirection: "row",
      alignItems: "center"
   },
   compatibilityPercentage: {
      marginRight: 30,
      width: 50,
      height: 50,
      borderRadius: 50 / 2,
      borderWidth: 0.5,
      textAlign: "center",
      textAlignVertical: "center"
   },
   descriptionParagraph: {
      marginBottom: 5
   },
   questionsContainer: {
      paddingTop: 10,
      flexDirection: "row",
      flexWrap: "wrap"
   },
   likeDislikeButtons: {
      alignSelf: "center", // This controls the horizontal position of the buttons.
      bottom: -28 // This controls the vertical position of the buttons.
   }
});

// tslint:disable-next-line: ban-ts-ignore-except-imports
// @ts-ignore
export default withNavigation(withTheme(ProfileCard));
