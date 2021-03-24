import React, { FC, useState } from "react";
import { StyleSheet, View } from "react-native";
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
import { FAB } from "react-native-paper";
import TagChipList from "../../common/TagChipList/TagChipList";

// TODO:
// Implementar tab con los tags del usuario para cambiarlos
// Implementar formulario de crear tag
// Cuando esta todo terminado y se ve bien activar que recuerde que cerraste el HelpBanner

export const TagsPage: FC = () => {
   const [searchString, setSearchString] = useState("");
   const { data: tagsFromServer } = useTags();
   const tagsDivided = useTagListDivided(tagsFromServer, { amountPerCategory: 10 });
   const tags = useTagsDividedScrollFormat(tagsDivided);
   const tagsOfSearchResult = useTagListFilteredBySearch(tagsFromServer, searchString);

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
               <TagChipList
                  sectionedList={tags}
                  showSubscribersAmount={false}
                  showSubscribersAmountOnModal={false}
                  hideCategory={true}
                  hideCategoryOnModal={false}
               />
            ) : (
               <TagChipList
                  flatList={tagsOfSearchResult}
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
   createButton: {
      position: "absolute",
      margin: 16,
      right: 10,
      bottom: 15,
      backgroundColor: currentTheme.colors.accent
   }
});
