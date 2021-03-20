import React, { FC, useState } from "react";
import { SectionList, StyleSheet } from "react-native";
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

// TODO: Probar si SectionList anda y la performance.
// Implementar tab con los tags del usuario para cambiarlos
// Implementar popup al tocar en un tag
// Implementar formulario de crear tag

export const TagsPage: FC = () => {
   const [searchString, setSearchString] = useState("");
   const { data: user } = useUser();
   const { data: tagsFromServer } = useTags();
   const tagListWithoutInteracted = useTagListWithoutInteracted(
      tagsFromServer,
      user?.tagsSubscribed,
      user?.tagsBlocked
   );
   const tagsDivided = useTagListDivided(tagListWithoutInteracted, { amountPerCategory: 10 });
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
               "Toca un tag, puedes suscribirte, navegar sus subscriptores u ocultarlos. También puedes crear nuevos"
            }
         />
         <TextInputExtended
            small
            placeholderText={"Buscar..."}
            saveButtonText={"Buscar"}
            style={styles.searchInput}
            value={searchString}
            onChangeText={t => setSearchString(t)}
            iconButton={searchString ? "backspace-outline" : null}
            onIconButtonPress={() => setSearchString("")}
         />
         <SectionList
            sections={!searchString ? tags : [{ data: tagsOfSearchResult }]}
            keyExtractor={tag => tag.tagId}
            renderSectionHeader={({ section: { title, data } }) =>
               data?.length > 0 && <TitleText style={styles.title}>{title}</TitleText>
            }
            renderItem={({ item: tag }) => (
               <TagChip tag={tag} showSubscribersAmount={searchString?.length > 0} />
            )}
         />
      </BasicScreenContainer>
   );
};

const styles: Styles = StyleSheet.create({
   searchInput: {
      paddingLeft: 20,
      paddingRight: 20
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
   }
});
