import React, { Component } from "react";
import color from "color";
import { ImageProps, Image, StatusBar, StyleSheet, View, Dimensions, Platform, ImageBackground } from "react-native";
import { Card, Paragraph, withTheme, Text, FAB } from "react-native-paper";
import ImagesScroll from "../ImagesScroll/ImagesScroll";
import ImagesModal from "../ImagesModal/ImagesModal";
import { Styles } from "../../../common-tools/ts-tools/Styles";
import { Themed, ThemeExt } from "../../../common-tools/themes/types/Themed";
import LikeDislikeButtons from "./LikeDislikeButtons/LikeDislikeButtons";
import ScrollViewExtended from "../ScrollViewExtended/ScrollViewExtended";
import QuestionInProfileCard from "./QuestionInProfileCard/QuestionInProfileCard";
import { User } from "../../../server-api/typings/User";
import { getAge } from "../../../server-api/tools/date-tools";
import EditButton from "./EditButton/EditButton";
import { withNavigation, NavigationInjectedProps, NavigationScreenProp } from "react-navigation";

export interface ProfileCardProps extends Themed, NavigationInjectedProps {
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
      imageSelected: 0,
   };

   render(): JSX.Element {
      const { 
         showLikeDislikeButtons, 
         onLikeClick, 
         onDislikeClick, 
         statusBarPadding, 
         editMode 
      }: Partial<ProfileCardProps> = this.props;
      const { 
         name, 
         photos, 
         birthdate, 
         area 
      }: Partial<User> = this.props.user;
      const { 
         renderImageModal, 
         imageSelected 
      }: Partial<ProfileCardState> = this.state;
      const { colors }: ThemeExt = this.props.theme as unknown as ThemeExt;
      const { navigate }: NavigationScreenProp<{}> = this.props.navigation;

      return (
         <>
            <View
               style={[
                  styles.mainContainer,
                  { paddingBottom: showLikeDislikeButtons ? styles.mainContainer.paddingBottom : 0 },
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
                              photos={photos}
                              style={[styles.galleryScroll, statusBarPadding && { marginTop: StatusBar.currentHeight }]}
                              onImageClick={(i: number) => this.setState({ imageSelected: i, renderImageModal: true })}
                              renderImage={(uri: string, imageProps: ImageProps) =>
                                 <ImageBackground
                                    style={{width: "100%", height: "100%" }}
                                    source={{uri}}
                                    blurRadius={Platform.OS === "ios" ? 120 : 60}
                                 >
                                    <Image
                                       {...imageProps}
                                       resizeMethod={"resize"}
                                       resizeMode={"contain"}
                                       key={uri}
                                    />
                                 </ImageBackground>
                              }
                           />
                           {
                              editMode && 
                                 <EditButton 
                                    showAtBottom
                                    label={"Cambiar Fotos"}
                                    onPress={() => navigate("ChangePictures")}
                                 />
                           }
                        </View>
                        <View style={styles.titleAreaContainer}>
                           <Card.Title
                              title={name}
                              subtitle={`${getAge(birthdate)} · ${area}`}
                              style={{ flex: 1 }}
                              titleStyle={{ color: colors.text }}
                              subtitleStyle={{ color: colors.text }}
                           />
                           {
                              !editMode ?
                                 <Text style={[styles.compatibilityPercentage, {
                                    borderColor: color(colors.statusOk).alpha(0.5).string(),
                                    backgroundColor: color(colors.statusOk).alpha(0.5).string(),
                                 }]}>
                                    99%
                                 </Text>
                              :
                                 <EditButton 
                                    onPress={() => navigate("ChangeBasicInfo")}
                                 />
                           }
                        </View>
                        <Card.Content>
                           <Paragraph style={[styles.descriptionParagraph, { color: colors.text }]}>
                              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                           </Paragraph>
                           {
                              editMode && 
                                 <EditButton 
                                    showAtBottom
                                    absolutePosition={false}
                                    label={"Modificar texto"}
                                    onPress={() => navigate("ChangeProfileText")}
                                 />
                           }
                           <View style={styles.questionsContainer}>
                              <QuestionInProfileCard 
                                 questionText="Lorem ipsum" 
                                 responseText="amet" 
                                 answerMatches={false} 
                              />
                              <QuestionInProfileCard 
                                 answerMatches={false} 
                                 questionText="Lorem ipsum dolor sit amet" 
                                 responseText="sed do eiusmod tempor" 
                              />
                              <QuestionInProfileCard 
                                 answerMatches={false} 
                                 questionText="Lorem" 
                                 responseText="sit"
                              />
                              <QuestionInProfileCard 
                                 questionText="Lorem ipsum" 
                                 responseText="amet"
                              />
                              <QuestionInProfileCard 
                                 questionText="Lorem" 
                                 responseText="sit"
                              />
                              <QuestionInProfileCard 
                                 questionText="Lorem ipsum dolor sit amet" 
                                 responseText="sed do eiusmod tempor"
                              />
                              <QuestionInProfileCard 
                                 questionText="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor" 
                                 responseText="Sed do eiusmod tempor."
                              />
                           </View>
                           {
                              editMode && 
                                 <EditButton 
                                    showAtBottom
                                    absolutePosition={false}
                                    label={"Revisar todas las preguntas"}
                                    onPress={() => navigate("ChangeQuestions")}
                                 />
                           }
                        </Card.Content>
                     </Card>
                  </ScrollViewExtended>
                  {
                     showLikeDislikeButtons &&
                     <LikeDislikeButtons
                        style={styles.likeDislikeButtons}
                        onLikeClick={() => onLikeClick()}
                        onDislikeClick={() => onDislikeClick()}
                     />
                  }
               </View>
            </View>
            {
               renderImageModal === true &&
                  <ImagesModal
                     visible={renderImageModal}
                     photos={photos}
                     initialPage={imageSelected}
                     onClose={() => this.setState({ renderImageModal: false })}
                  />
            }
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
      paddingBottom: 47,          // The bottom padding under the like-dislike buttons (only applied when buttons are present). 
   },
   scrollView: {
      flexGrow: 0,
   },
   card: {
      paddingBottom: 30,          // Padding in the content when scrolled to bottom to prevent like-dislike buttons from covering text. (Only applied if the like-dislike buttons are visible).
   },
   galleryScroll: {
      height: Dimensions.get("window").height * 0.5,  // This controls the height of the images area.
   },
   titleAreaContainer: {
      flexDirection: "row",
      alignItems: "center",
   },
   compatibilityPercentage: {
      marginRight: 30,
      width: 50,
      height: 50,
      borderRadius: 50 / 2,
      borderWidth: 0.5,
      textAlign: "center",
      textAlignVertical: "center",
   },
   descriptionParagraph: {
      marginBottom: 5,
   },
   questionsContainer: {
      paddingTop: 10,
      flexDirection: "row",
      flexWrap: "wrap",
   },
   likeDislikeButtons: {
      alignSelf: "center",        // This controls the horizontal position of the buttons.
      bottom: -28,                // This controls the vertical position of the buttons.
   },
});

export default withNavigation(withTheme(ProfileCard));
