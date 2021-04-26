import React, { FC, useMemo, useState } from "react";
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
import { Card, Paragraph } from "react-native-paper";
import ImagesScroll from "../ImagesScroll/ImagesScroll";
import ImagesModal from "../ImagesModal/ImagesModal";
import { Styles } from "../../../common-tools/ts-tools/Styles";
import LikeDislikeButtons from "./LikeDislikeButtons/LikeDislikeButtons";
import ScrollViewExtended from "../ScrollViewExtended/ScrollViewExtended";
import EditButton from "./EditButton/EditButton";
import { User } from "../../../api/server/shared-tools/endpoints-interfaces/user";
import { useUser } from "../../../api/server/user";
import { useTags } from "../../../api/server/tags";
import { useTheme } from "../../../common-tools/themes/useTheme/useTheme";
import { fromBirthDateToAge } from "../../../api/tools/date-tools";
import { LoadingAnimation, RenderMethod } from "../LoadingAnimation/LoadingAnimation";
import { useServerInfo } from "../../../api/server/server-info";
import { toFirstUpperCase } from "../../../common-tools/js-tools/js-tools";
import { currentTheme } from "../../../config";
import { ParamsRegistrationFormsPage } from "../../pages/RegistrationFormsPage/RegistrationFormsPage";
import { useNavigation } from "../../../common-tools/navigation/useNavigation";
import CardAnimator, { CardAnimationType } from "./CardAnimator/CardAnimator";
import { getGenderName } from "../../../common-tools/strings/gender";
import { prepareUrl } from "../../../api/tools/httpRequest";
import { Tag } from "../../../api/server/shared-tools/endpoints-interfaces/tags";
import TagChipList from "../TagChipList/TagChipList";
import MoreModal from "./MoreModal/MoreModal";
import { useCallback } from "react";
import { userFinishedRegistration } from "../../../api/tools/userTools";

export interface ProfileCardProps {
   user: User;
   showLikeDislikeButtons?: boolean;
   editMode?: boolean;
   statusBarPadding?: boolean;
   onLikePress?: () => void;
   onDislikePress?: () => void;
   onUndoPress?: () => void;
}

const ProfileCard: FC<ProfileCardProps> = props => {
   const {
      showLikeDislikeButtons,
      onLikePress,
      onDislikePress,
      onUndoPress,
      statusBarPadding,
      editMode
   }: Partial<ProfileCardProps> = props;

   const {
      name,
      userId,
      images,
      birthDate,
      cityName,
      height,
      gender,
      profileDescription,
      isCoupleProfile,
      tagsSubscribed,
      tagsBlocked
   }: Partial<User> = props.user;

   const genderText: string = getGenderName(gender, isCoupleProfile);

   const { navigate } = useNavigation();
   const [renderImageModal, setRenderImageModal] = useState(false);
   const [showMoreOptionsModal, setShowMoreOptionsModal] = useState(false);
   const [imageSelected, setImageSelected] = useState(0);
   const [animate, setAnimate] = useState<CardAnimationType>(null);
   const [onAnimationFinish, setOnAnimationFinish] = useState<{ func: () => void }>(null);
   const { colors } = useTheme();
   const { data: localUser } = useUser();
   const { data: allTags, isLoading: tagsLoading } = useTags();
   const { data: serverInfo, isLoading: serverInfoLoading } = useServerInfo();

   const tagsSubscribedInCommon: Tag[] = useMemo(
      () =>
         tagsSubscribed
            ?.filter(t => localUser?.tagsSubscribed.find(ut => ut.tagId === t.tagId) != null)
            .map(t => allTags?.find(at => at.tagId === t.tagId))
            .filter(t => t != null),
      [localUser, tagsSubscribed, allTags]
   );

   // const tagsBlockedInCommon: Tag[] = useMemo(
   //    () =>
   //       tagsBlocked
   //          ?.filter(t => localUser?.tagsBlocked.find(ut => ut.tagId === t.tagId) != null)
   //          .map(t => allTags?.find(at => at.tagId === t.tagId))
   //          .filter(t => t != null),
   //    [localUser, tagsSubscribed, allTags]
   // );

   const finalImagesUri = useMemo(
      () => images.map(uri => prepareUrl(serverInfo.imagesHost + uri)),
      [images]
   );

   const handleLikePress = useCallback(() => {
      setOnAnimationFinish({ func: onLikePress });
      setAnimate(CardAnimationType.Like);
   }, [onLikePress]);

   const handleDislikePress = useCallback(() => {
      setOnAnimationFinish({ func: onDislikePress });
      setAnimate(CardAnimationType.Dislike);
   }, [onDislikePress]);

   const handleMoreOptionsPress = useCallback(() => {
      setShowMoreOptionsModal(true);
   }, []);

   const handleMoreOptionsClose = useCallback(() => {
      setShowMoreOptionsModal(false);
   }, []);

   if (!localUser || tagsLoading || serverInfoLoading) {
      return <LoadingAnimation renderMethod={RenderMethod.FullScreen} />;
   }

   return (
      <>
         <CardAnimator animate={animate} onAnimationFinish={onAnimationFinish?.func}>
            <View style={styles.mainContainer}>
               <ScrollViewExtended
                  style={[styles.scrollView]}
                  showBottomGradient={true}
                  bottomGradientColor={colors.background}
                  indicatorStyle={"white"}
               >
                  <Card style={styles.card}>
                     <View>
                        <ImagesScroll
                           images={finalImagesUri}
                           style={[
                              styles.galleryScroll,
                              statusBarPadding && { marginTop: StatusBar.currentHeight }
                           ]}
                           onImageClick={(i: number) => {
                              setImageSelected(i);
                              setRenderImageModal(true);
                           }}
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
                              style={{ marginBottom: 60, marginRight: -6 }}
                              label={"Modificar fotos"}
                              onPress={() =>
                                 navigate<ParamsRegistrationFormsPage>("RegistrationForms", {
                                    formsToShow: ["ProfileImagesForm"]
                                 })
                              }
                           />
                        )}
                     </View>
                     <View style={styles.titleAreaContainer}>
                        <Card.Title
                           title={`${toFirstUpperCase(name)}${isCoupleProfile ? " (Pareja)" : ""}`}
                           subtitle={`${fromBirthDateToAge(birthDate)} · ${cityName}${
                              height ? " · " + height + "cm" : ""
                           }`}
                           style={{ flex: 1 }}
                           titleStyle={styles.nameText}
                           subtitleStyle={styles.basicInfoText}
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
                           <EditButton
                              onPress={() =>
                                 navigate<ParamsRegistrationFormsPage>("RegistrationForms", {
                                    formsToShow: ["BasicInfoForm"]
                                 })
                              }
                           />
                        )}
                        <Paragraph style={styles.interestParagraph}>{genderText}</Paragraph>
                     </View>
                     <Card.Content>
                        <Paragraph style={styles.descriptionParagraph}>
                           {profileDescription}
                        </Paragraph>
                        {editMode && (
                           <EditButton
                              showAtBottom
                              absolutePosition={false}
                              label={"Modificar texto"}
                              onPress={() =>
                                 navigate<ParamsRegistrationFormsPage>("RegistrationForms", {
                                    formsToShow: ["ProfileDescriptionForm"]
                                 })
                              }
                           />
                        )}
                        <View style={styles.tagsListContainer}>
                           <TagChipList
                              notScrollingFlatList={tagsSubscribedInCommon}
                              tagChipStyle={styles.tagChip}
                              highlightSubscribedAndBlocked={false}
                              showSubscribersAmount={false}
                              showSubscribersAmountOnModal={false}
                              hideCategory={true}
                              hideCategoryOnModal={false}
                           />
                        </View>
                        {
                           /*
                            * This is commented because it can be interpreted as incompatibility but it's a negative compatibility
                            */
                           // <View style={styles.tagsListContainer}>
                           //    <TagChipList
                           //       notScrollingFlatList={tagsBlockedInCommon}
                           //       tagChipStyle={styles.tagChip}
                           //       highlightSubscribedAndBlocked={true}
                           //       showSubscribersAmount={false}
                           //       showSubscribersAmountOnModal={false}
                           //       hideCategory={true}
                           //       hideCategoryOnModal={false}
                           //    />
                           // </View>
                        }
                     </Card.Content>
                  </Card>
               </ScrollViewExtended>
               {showLikeDislikeButtons && (
                  <LikeDislikeButtons
                     style={styles.likeDislikeButtons}
                     onLikePress={handleLikePress}
                     onDislikePress={handleDislikePress}
                     onUndoPress={onUndoPress}
                     onMorePress={handleMoreOptionsPress}
                  />
               )}
            </View>
         </CardAnimator>
         {renderImageModal === true && (
            <ImagesModal
               visible={renderImageModal}
               images={finalImagesUri}
               initialPage={imageSelected}
               onClose={() => setRenderImageModal(false)}
            />
         )}
         {showMoreOptionsModal === true && (
            <MoreModal userToReportId={userId} onClose={handleMoreOptionsClose} />
         )}
      </>
   );
};

const styles: Styles = StyleSheet.create({
   mainContainer: {
      flex: 1,
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: currentTheme.colors.background
   },
   scrollView: {
      flexGrow: 0
   },
   card: {
      backgroundColor: currentTheme.colors.background,
      paddingBottom: 0, // Padding in the content when scrolled to bottom to prevent like-dislike buttons from covering text.
      elevation: 0
   },
   galleryScroll: {
      height: Dimensions.get("window").height * 0.48 // This controls the height of the images area.
   },
   titleAreaContainer: {
      flexDirection: "column",
      alignItems: "flex-start",
      position: "relative",
      borderRadius: currentTheme.roundness,
      transform: [{ translateY: -currentTheme.roundness }], // Border on top of image effect
      backgroundColor: currentTheme.colors.background
   },
   // Not used:
   compatibilityPercentage: {
      marginRight: 30,
      width: 50,
      height: 50,
      borderRadius: 50 / 2,
      borderWidth: 0.5,
      textAlign: "center",
      textAlignVertical: "center"
   },
   nameText: {
      color: currentTheme.colors.text,
      fontFamily: currentTheme.font.light
   },
   basicInfoText: {
      color: currentTheme.colors.text,
      fontFamily: currentTheme.font.light
   },
   interestParagraph: {
      color: currentTheme.colors.text,
      fontFamily: currentTheme.font.regular,
      fontSize: 12,
      marginTop: -11,
      paddingLeft: 16
   },
   descriptionParagraph: {
      color: currentTheme.colors.text,
      fontFamily: currentTheme.font.light,
      marginBottom: 5,
      fontSize: 15
   },
   tagsListContainer: {
      paddingTop: 10,
      flexDirection: "row",
      flexWrap: "wrap"
   },
   likeDislikeButtons: {
      alignSelf: "center", // This controls the horizontal position of the buttons.
      bottom: 17 // This controls the vertical position of the buttons.
   },
   tagChip: {
      marginLeft: 0
   }
});

export default ProfileCard;
