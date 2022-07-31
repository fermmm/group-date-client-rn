import React, { FC, useMemo, useState } from "react";
import {
   ImageProps,
   Image,
   StyleSheet,
   View,
   Dimensions,
   Platform,
   ImageBackground,
   ImageSourcePropType
} from "react-native";
import { Card, Paragraph, Text } from "react-native-paper";
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
import { toFirstUpperCase } from "../../../common-tools/js-tools/js-tools";
import { currentTheme } from "../../../config";
import { ParamsRegistrationFormsPage } from "../../pages/RegistrationFormsPage/RegistrationFormsPage";
import { useNavigation } from "../../../common-tools/navigation/useNavigation";
import CardAnimator, { CardAnimationType } from "./CardAnimator/CardAnimator";
import { getGenderName } from "../../../common-tools/strings/gender";
import { Tag } from "../../../api/server/shared-tools/endpoints-interfaces/tags";
import TagChipList from "../TagChipList/TagChipList";
import ReportModal from "./ReportModal/ReportModal";
import { useCallback } from "react";
import { removeBannedWords } from "../../../common-tools/strings/social";
import { useOnlyVisibleTags } from "../../../common-tools/tags/useOnlyVisibleTags";
import { useImageFullUrl } from "../../../api/tools/useImageFullUrl";

export interface ProfileCardProps {
   user: User;
   showLikeDislikeButtons?: boolean;
   editMode?: boolean;
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
      editMode
   }: Partial<ProfileCardProps> = props;

   const {
      name,
      userId,
      images,
      birthDate,
      cityName,
      height,
      genders,
      profileDescription,
      isCoupleProfile,
      tagsSubscribed,
      tagsBlocked
   }: Partial<User> = props.user;

   const genderText: string = getGenderName(genders, isCoupleProfile);

   const { navigate } = useNavigation();
   const { getImageFullUrl, isLoading: imagesFullUrlLoading } = useImageFullUrl();
   const [renderImageModal, setRenderImageModal] = useState(false);
   const [reportModalOpen, setReportModalOpen] = useState(false);
   const [imageSelected, setImageSelected] = useState(0);
   const [animate, setAnimate] = useState<CardAnimationType>(null);
   const [onAnimationFinish, setOnAnimationFinish] = useState<{ func: () => void }>(null);
   const { colors } = useTheme();
   const { data: localUser } = useUser();
   const { data: allTags, isLoading: tagsLoading } = useTags();
   const isOwnProfile = localUser?.userId === userId;

   const tagsSubscribedInCommon: Tag[] = useOnlyVisibleTags(
      useMemo(
         () =>
            tagsSubscribed
               ?.filter(t => localUser?.tagsSubscribed?.find(ut => ut.tagId === t.tagId) != null)
               .map(t => allTags?.find(at => at.tagId === t.tagId))
               .filter(t => t != null) ?? [],
         [localUser, tagsSubscribed, allTags]
      )
   );

   // const tagsBlockedInCommon: Tag[] = useOnlyVisibleTags(useMemo(
   //    () =>
   //       tagsBlocked
   //          ?.filter(t => localUser?.tagsBlocked.find(ut => ut.tagId === t.tagId) != null)
   //          .map(t => allTags?.find(at => at.tagId === t.tagId))
   //          .filter(t => t != null),
   //    [localUser, tagsSubscribed, allTags]
   // ));

   const handleLikePress = useCallback(() => {
      setOnAnimationFinish({ func: onLikePress });
      setAnimate(CardAnimationType.Like);
   }, [onLikePress]);

   const handleDislikePress = useCallback(() => {
      setOnAnimationFinish({ func: onDislikePress });
      setAnimate(CardAnimationType.Dislike);
   }, [onDislikePress]);

   const handleFlagPress = useCallback(() => {
      setReportModalOpen(true);
   }, []);

   const handleReportModalClose = useCallback(() => {
      setReportModalOpen(false);
   }, []);

   if (!localUser || tagsLoading || imagesFullUrlLoading) {
      return <LoadingAnimation renderMethod={RenderMethod.FullScreen} />;
   }

   const finalImages = images?.map(uri => getImageFullUrl(uri)) ?? [];

   return (
      <>
         <CardAnimator animate={animate} onAnimationFinish={onAnimationFinish?.func}>
            <View style={styles.mainContainer}>
               <ScrollViewExtended
                  style={styles.scrollView}
                  showBottomGradient={true}
                  bottomGradientColor={colors.background}
                  indicatorStyle={"white"}
               >
                  <Card style={styles.card}>
                     <View>
                        <ImagesScroll
                           images={finalImages}
                           style={[styles.galleryScroll]}
                           onImageClick={(i: number) => {
                              setImageSelected(i);
                              setRenderImageModal(true);
                           }}
                           renderImage={(
                              image: ImageSourcePropType,
                              imageProps: ImageProps,
                              key: string | number
                           ) => (
                              <ImageBackground
                                 style={{ width: "100%", height: "100%" }}
                                 source={image}
                                 blurRadius={Platform.OS === "ios" ? 120 : 60}
                              >
                                 <Image
                                    {...imageProps}
                                    resizeMethod={"resize"}
                                    resizeMode={"contain"}
                                    key={key}
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
                              height ? ` · Altura: ${height} cm` : ""
                           }`}
                           style={{ flex: 1 }}
                           titleStyle={styles.nameText}
                           subtitleStyle={styles.basicInfoText}
                        />
                        {!editMode ? (
                           <View />
                        ) : (
                           // Maybe copying Okc it's not a good idea, this features is probably useless:
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
                        {profileDescription?.length > 0 && (
                           <Paragraph style={styles.descriptionParagraph}>
                              {isOwnProfile
                                 ? profileDescription
                                 : removeBannedWords(profileDescription)}
                           </Paragraph>
                        )}
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
                        {tagsSubscribedInCommon?.length > 0 && (
                           <>
                              <Text style={styles.tagsTitleText}>Tags en común:</Text>
                              <View style={styles.tagsListContainer}>
                                 <TagChipList
                                    notScrollingListHorizontal={tagsSubscribedInCommon}
                                    tagChipStyle={styles.tagChip}
                                    highlightSubscribedAndBlocked={false}
                                    showSubscribersAmount={false}
                                    showSubscribersAmountOnModal={false}
                                    hideCategory={true}
                                    hideCategoryOnModal={false}
                                    small={true}
                                 />
                              </View>
                           </>
                        )}
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
                     onFlagPress={handleFlagPress}
                  />
               )}
            </View>
         </CardAnimator>
         {renderImageModal === true && (
            <ImagesModal
               visible={renderImageModal}
               images={finalImages}
               initialPage={imageSelected}
               onClose={() => setRenderImageModal(false)}
            />
         )}
         {reportModalOpen === true && (
            <ReportModal targetUserId={userId} onClose={handleReportModalClose} />
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
      height: Dimensions.get("window").height * 0.6 // This controls the height of the images area.
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
      fontSize: 18
   },
   tagsTitleText: {
      color: currentTheme.colors.text,
      fontFamily: currentTheme.font.regular,
      marginBottom: 5,
      marginTop: 25,
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
