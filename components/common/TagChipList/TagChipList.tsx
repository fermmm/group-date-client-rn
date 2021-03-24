import React, { FC, memo, useCallback, useState } from "react";
import { FlatList, SectionList, StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { Tag } from "../../../api/server/shared-tools/endpoints-interfaces/tags";
import { useUser } from "../../../api/server/user";
import { Styles } from "../../../common-tools/ts-tools/Styles";
import { currentTheme } from "../../../config";
import TagChip from "../TagChip/TagChip";
import { TagModal } from "../TagChip/TagModal/TagModal";
import TitleText from "../TitleText/TitleText";

export interface PropsTagChipList {
   flatList?: Tag[];
   sectionedList?: Array<{ title?: string; data: Tag[] }>;
   notScrollingFlatList?: Tag[];
   showSubscribersAmount?: boolean;
   showSubscribersAmountOnModal?: boolean;
   highlightSubscribedAndBlocked?: boolean;
   hideCategory?: boolean;
   hideCategoryOnModal?: boolean;
   tagChipStyle?: StyleProp<ViewStyle>;
}

const TagChipList: FC<PropsTagChipList> = props => {
   const {
      flatList,
      sectionedList,
      showSubscribersAmount,
      showSubscribersAmountOnModal,
      highlightSubscribedAndBlocked = true,
      notScrollingFlatList,
      tagChipStyle,
      hideCategory,
      hideCategoryOnModal
   } = props;
   const [selectedTag, setSelectedTag] = useState<Tag>(null);
   const [showModal, setShowModal] = useState(false);
   const { data: user } = useUser();

   const userIsSubscribedToTag = useCallback(
      (tag: Tag) => {
         return user?.tagsSubscribed?.find(t => t.tagId === tag.tagId) != null;
      },
      [user]
   );

   const userIsBlockingToTag = useCallback(
      (tag: Tag) => {
         return user?.tagsBlocked?.find(t => t.tagId === tag.tagId) != null;
      },
      [user]
   );

   const onTagPress = useCallback((tag: Tag) => {
      setSelectedTag(tag);
      setShowModal(true);
   }, []);

   const onModalClose = useCallback(() => {
      setShowModal(false);
   }, []);

   const renderHeader = useCallback(
      ({ section: { title, data } }) =>
         data?.length > 0 && <TitleText style={styles.title}>{title}</TitleText>,
      []
   );

   const keyExtractor = useCallback(tag => tag.tagId, []);

   const renderTagChip = useCallback(
      ({ item: tag, key }) => (
         <TagChip
            tag={tag}
            style={[styles.tagChip, tagChipStyle]}
            showSubscribersAmount={showSubscribersAmount}
            userSubscribed={highlightSubscribedAndBlocked ? userIsSubscribedToTag(tag) : false}
            userBlocked={highlightSubscribedAndBlocked ? userIsBlockingToTag(tag) : false}
            onPress={onTagPress}
            key={key != null ? key : null}
            hideCategory={hideCategory}
         />
      ),
      [showSubscribersAmount, user]
   );

   return (
      <View style={[]}>
         {flatList ? (
            <FlatList
               data={flatList}
               keyExtractor={keyExtractor}
               renderItem={renderTagChip}
               contentContainerStyle={styles.listScroll}
            />
         ) : sectionedList ? (
            <SectionList
               sections={sectionedList}
               keyExtractor={keyExtractor}
               renderSectionHeader={renderHeader}
               renderItem={renderTagChip}
               contentContainerStyle={styles.listScroll}
            />
         ) : (
            notScrollingFlatList &&
            notScrollingFlatList.map(tag => renderTagChip({ item: tag, key: tag.tagId }))
         )}
         {showModal && (
            <TagModal
               tag={selectedTag}
               onClose={onModalClose}
               showSubscribersAmount={showSubscribersAmountOnModal}
               hideCategory={hideCategoryOnModal}
            />
         )}
      </View>
   );
};

const styles: Styles = StyleSheet.create({
   listContainer: {
      paddingLeft: 15
   },
   title: {
      fontFamily: currentTheme.fonts.light.fontFamily,
      marginTop: 25,
      marginBottom: 45,
      paddingLeft: 10,
      paddingRight: 10,
      textAlign: "center"
   },
   listScroll: {
      paddingTop: 90,
      paddingBottom: 90
   },
   tagChip: { marginLeft: 15 }
});

export default memo(TagChipList);
