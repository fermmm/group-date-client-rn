import React, { FC, useRef, useState } from "react";
import { StyleSheet, TextInput, View } from "react-native";
import { useTags } from "../../../api/server/tags";
import BasicScreenContainer from "../../common/BasicScreenContainer/BasicScreenContainer";
import { LoadingAnimation, RenderMethod } from "../../common/LoadingAnimation/LoadingAnimation";
import { Styles } from "../../../common-tools/ts-tools/Styles";
import { useTagListDivided } from "./tools/useTagListDivided";
import TextInputExtended from "../../common/TextInputExtended/TextInputExtended";
import { currentTheme } from "../../../config";
import { useTagListFilteredBySearch } from "./tools/useTagsListFilteredBySearch";
import { HelpBanner } from "../../common/HelpBanner/HelpBanner";
import { useTagsDividedScrollFormat } from "./tools/useTagsDividedScrollFormat";
import { Button, FAB } from "react-native-paper";
import TagChipList from "../../common/TagChipList/TagChipList";
import { useUserTags } from "./tools/useUserTags";
import { useNavigation } from "../../../common-tools/navigation/useNavigation";

// TODO:
// Tal vez seria bueno volver a mostrar el modal del tag cuando se vuelve atras de navegar los tags
// puede ser que sin cerrarlo se oculte si el modal es de alguna manera child del componente, probar
// Cuando esta todo terminado y se ve bien activar que recuerde que cerraste el HelpBanner

export const TagsPage: FC = () => {
   const [searchString, setSearchString] = useState("");
   const [showUserTags, setShowUserTags] = useState(false);
   const searchInputRef = useRef<TextInput>();
   const { navigate } = useNavigation();
   const { data: tagsFromServer } = useTags();
   const tagsDivided = useTagListDivided(tagsFromServer, { amountPerCategory: 10 });
   const tags = useTagsDividedScrollFormat(tagsDivided);
   const tagsOfSearchResult = useTagListFilteredBySearch(tagsFromServer, searchString);
   const userTags = useUserTags(tagsFromServer);
   const listToShow = searchString
      ? TagListType.SearchResult
      : showUserTags
      ? TagListType.UserTags
      : TagListType.All;

   if (!tagsFromServer) {
      return <LoadingAnimation renderMethod={RenderMethod.FullScreen} />;
   }

   return (
      <BasicScreenContainer wrapChildrenInScrollView={false}>
         <HelpBanner
            showCloseButton
            rememberClose={false}
            text={
               "Puedes crear tags y los usarán lxs demás. Toca un tag para suscribirte, navegar sus subscriptores u ocultarlos."
            }
         />
         <View style={styles.mainContainer}>
            <View style={styles.header}>
               <TextInputExtended
                  small
                  value={searchString}
                  onChangeText={t => {
                     setSearchString(t);
                     setShowUserTags(false);
                  }}
                  placeholderText={"Buscar..."}
                  containerStyle={styles.searchInput}
                  iconButton={searchString ? "backspace" : null}
                  onIconButtonPress={() => {
                     setSearchString("");
                     searchInputRef?.current?.blur();
                  }}
                  fullScreenTyping={false}
                  inputRef={searchInputRef}
               />
               <Button
                  style={styles.buttonMyTags}
                  mode={showUserTags ? "contained" : "text"}
                  onPress={() => {
                     setShowUserTags(!showUserTags);
                     setSearchString("");
                     searchInputRef?.current?.blur();
                  }}
               >
                  Mis tags
               </Button>
            </View>
            {listToShow === TagListType.All && (
               <TagChipList
                  sectionedList={tags}
                  showSubscribersAmount={false}
                  showSubscribersAmountOnModal={false}
                  hideCategory={true}
                  hideCategoryOnModal={false}
               />
            )}
            {listToShow === TagListType.SearchResult && (
               <TagChipList
                  flatList={tagsOfSearchResult}
                  showSubscribersAmount={false}
                  showSubscribersAmountOnModal={false}
                  hideCategory={true}
                  hideCategoryOnModal={false}
               />
            )}
            {listToShow === TagListType.UserTags && (
               <TagChipList
                  sectionedList={userTags}
                  showSubscribersAmount={false}
                  showSubscribersAmountOnModal={false}
                  hideCategory={true}
                  hideCategoryOnModal={false}
               />
            )}
         </View>
         <FAB
            style={styles.createButton}
            small
            icon="plus"
            label="Crear tag"
            onPress={() => navigate("CreateTag")}
         />
      </BasicScreenContainer>
   );
};

const styles: Styles = StyleSheet.create({
   mainContainer: {
      flex: 1
   },
   header: {
      position: "absolute",
      flexDirection: "row",
      alignItems: "center",
      top: 20,
      zIndex: 10,
      width: "100%",
      paddingLeft: 15,
      paddingRight: 15
   },
   searchInput: {
      flex: 1,
      marginBottom: 0
   },
   buttonMyTags: { marginLeft: 10 },
   firstTitle: {
      fontFamily: currentTheme.fonts.light.fontFamily,
      marginBottom: 25,
      paddingLeft: 10,
      paddingRight: 10,
      textAlign: "center"
   },
   createButton: {
      position: "absolute",
      margin: 16,
      right: 10,
      bottom: 15,
      backgroundColor: currentTheme.colors.accent
   }
});

enum TagListType {
   All,
   SearchResult,
   UserTags
}
