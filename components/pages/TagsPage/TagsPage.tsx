import React, { FC, useState } from "react";
import { StyleSheet } from "react-native";
import { useTags } from "../../../api/server/tags";
import BasicScreenContainer from "../../common/BasicScreenContainer/BasicScreenContainer";
import { LoadingAnimation, RenderMethod } from "../../common/LoadingAnimation/LoadingAnimation";
import { Styles } from "../../../common-tools/ts-tools/Styles";
import TagChip from "../../common/TagChip/TagChip";
import { useTagListDivided } from "./tools/useTagListDivided";
import TitleText from "../../common/TitleText/TitleText";
import { Tag } from "../../../api/server/shared-tools/endpoints-interfaces/tags";
import { useUser } from "../../../api/server/user";
import { useTagListWithoutInteracted } from "./tools/useTagListWithoutInteracted";
import TextInputExtended from "../../common/TextInputExtended/TextInputExtended";
import { currentTheme } from "../../../config";
import { useTagListFilteredBySearch } from "./tools/useTagsListFilteredBySearch";
import { HelpBanner } from "../../common/HelpBanner/HelpBanner";

// TODO:
// A partir de cierta cantidad por ejemplo 300 no se renderea mas y se pide usar el buscador con un mensaje
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
   const tags = useTagListDivided(tagListWithoutInteracted, {
      amountPerCategory: 10
   });
   const tagsOfSearchResult = useTagListFilteredBySearch(tagsFromServer, searchString);

   if (!tagsFromServer) {
      return <LoadingAnimation renderMethod={RenderMethod.FullScreen} />;
   }

   const renderTagList = (
      title: string,
      list: Tag[],
      showSubscribersAmount: boolean = false,
      firstToRender?: boolean
   ) => {
      if (list.length === 0) {
         return null;
      }

      return (
         <>
            {title && (
               <TitleText style={firstToRender ? styles.firstTitle : styles.title}>
                  {title}
               </TitleText>
            )}
            {list.map(tag => (
               <TagChip
                  tag={tag}
                  showSubscribersAmount={showSubscribersAmount}
                  style={styles.tagChip}
                  key={tag.tagId}
               />
            ))}
         </>
      );
   };

   return (
      <BasicScreenContainer>
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
         {!searchString ? (
            <>
               {renderTagList(
                  "Últimos con interacción",
                  tags.withMostRecentInteraction,
                  false,
                  true
               )}
               {renderTagList("Nuevos", tags.newest)}
               {renderTagList("Más populares", tags.withMoreSubscribersAndBlockersMixed)}
               {renderTagList("De los creadores de la app", tags.globals)}
               {renderTagList("El resto", tags.rest)}
            </>
         ) : (
            renderTagList(null, tagsOfSearchResult, true)
         )}
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
   },
   tagChip: {
      marginLeft: 5
   }
});
