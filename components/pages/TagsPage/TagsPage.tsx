import React, { FC, useState } from "react";
import { SectionList, StyleSheet, View } from "react-native";
import { useTags } from "../../../api/server/tags";
import BasicScreenContainer from "../../common/BasicScreenContainer/BasicScreenContainer";
import { LoadingAnimation, RenderMethod } from "../../common/LoadingAnimation/LoadingAnimation";
import { Styles } from "../../../common-tools/ts-tools/Styles";
import TagChip from "../../common/TagChip/TagChip";
import { useTagListDivided } from "./tools/useTagListDivided";
import TitleText from "../../common/TitleText/TitleText";
import { useUser } from "../../../api/server/user";
import { useTagListWithoutInteracted } from "./tools/useTagListWithoutInteracted";
import TextInputExtended from "../../common/TextInputExtended/TextInputExtended";
import { currentTheme } from "../../../config";
import { useTagListFilteredBySearch } from "./tools/useTagsListFilteredBySearch";
import { HelpBanner } from "../../common/HelpBanner/HelpBanner";
import { useTagsDividedScrollFormat } from "./tools/useTagsDividedScrollFormat";
import { FlatList } from "react-native-gesture-handler";
import { FAB } from "react-native-paper";
import { Tag } from "../../../api/server/shared-tools/endpoints-interfaces/tags";

// TODO:
// Implementar tab con los tags del usuario para cambiarlos
// Implementar formulario de crear tag
// Cuando esta todo terminado y se ve bien activar que recuerde que cerraste el HelpBanner

export const TagsPage: FC = () => {
   const [searchString, setSearchString] = useState("");
   const { data: user } = useUser();
   const { data: tagsFromServer } = useTags();
   const tagsDivided = useTagListDivided(tagsFromServer, { amountPerCategory: 10 });
   const tags = useTagsDividedScrollFormat(tagsDivided);
   const tagsOfSearchResult = useTagListFilteredBySearch(tagsFromServer, searchString);

   const userSubscribedToTag = (tag: Tag) => {
      return user?.tagsSubscribed?.find(t => t.tagId === tag.tagId) != null;
   };

   const userBlockedToTag = (tag: Tag) => {
      return user?.tagsBlocked?.find(t => t.tagId === tag.tagId) != null;
   };

   if (!tagsFromServer) {
      return <LoadingAnimation renderMethod={RenderMethod.FullScreen} />;
   }

   return (
      <BasicScreenContainer wrapChildrenInScrollView={false}>
         <HelpBanner
            showCloseButton
            rememberClose={false}
            text={
               "Toca un tag para suscribirte, navegar sus subscriptores u ocultarlos. También puedes crear nuevos"
            }
         />
         <View style={styles.searchAndListContainer}>
            <TextInputExtended
               small
               value={searchString}
               onChangeText={t => setSearchString(t)}
               placeholderText={"Buscar..."}
               containerStyle={styles.searchInput}
               iconButton={searchString ? "backspace-outline" : null}
               onIconButtonPress={() => setSearchString("")}
               fullScreenTyping={false}
            />
            {!searchString ? (
               <SectionList
                  sections={tags}
                  keyExtractor={tag => tag.tagId}
                  renderSectionHeader={({ section: { title, data } }) =>
                     data?.length > 0 && <TitleText style={styles.title}>{title}</TitleText>
                  }
                  renderItem={({ item: tag }) => (
                     <TagChip
                        tag={tag}
                        style={styles.tagChip}
                        userSubscribed={userSubscribedToTag(tag)}
                        userBlocked={userBlockedToTag(tag)}
                     />
                  )}
                  contentContainerStyle={styles.listScroll}
               />
            ) : (
               <FlatList
                  data={tagsOfSearchResult}
                  keyExtractor={tag => tag.tagId}
                  renderItem={({ item: tag }) => (
                     <TagChip
                        tag={tag}
                        style={styles.tagChip}
                        showSubscribersAmount
                        userSubscribed={userSubscribedToTag(tag)}
                        userBlocked={userBlockedToTag(tag)}
                     />
                  )}
                  contentContainerStyle={styles.listScroll}
               />
            )}
         </View>
         <FAB
            style={styles.createButton}
            small
            icon="plus"
            label="Crear tag"
            onPress={() => console.log("Pressed")}
         />
      </BasicScreenContainer>
   );
};

const styles: Styles = StyleSheet.create({
   searchAndListContainer: {
      flex: 1
   },
   searchInput: {
      position: "absolute",
      top: 20,
      zIndex: 10,
      width: "100%",
      paddingLeft: 15,
      paddingRight: 15
   },
   firstTitle: {
      fontFamily: currentTheme.fonts.light.fontFamily,
      marginBottom: 25,
      paddingLeft: 10,
      paddingRight: 10,
      textAlign: "center"
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
   tagChip: {
      marginLeft: 15
   },
   createButton: {
      position: "absolute",
      margin: 16,
      right: 10,
      bottom: 15,
      backgroundColor: currentTheme.colors.accent
   }
});
