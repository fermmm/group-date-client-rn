import React, { FC } from "react";
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

// TODO:
// A partir de cierta cantidad por ejemplo 300 no se renderea mas y se pide usar el buscador con un mensaje
// Implementar buscador
// Implementar tab con los tags del usuario para cambiarlos
// Implementar popup al tocar en un tag
// Implementar formulario de crear tag

// Los tags deberian mostrar el numero de subscriptores por que sirve para decidir a cual subscrivirse cuando hay
// muchos similares en un resultado de busqueda, solo hace falta en los resultados de busqueda

export const TagsPage: FC = () => {
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

   if (!tagsFromServer) {
      return <LoadingAnimation renderMethod={RenderMethod.FullScreen} />;
   }

   const renderTagList = (title: string, list: Tag[], showSubscribersAmount: boolean = false) => {
      if (list.length === 0) {
         return null;
      }

      return (
         <>
            <TitleText style={styles.title}>{title}</TitleText>
            {list.map(tag => (
               <TagChip tag={tag} showSubscribersAmount={showSubscribersAmount} key={tag.tagId} />
            ))}
         </>
      );
   };

   return (
      <BasicScreenContainer>
         {renderTagList("Últimos con interacción", tags.withMostRecentInteraction)}
         {renderTagList("Nuevos", tags.newest)}
         {renderTagList("Más populares", tags.withMoreSubscribersAndBlockersMixed)}
         {renderTagList("De los creadores de la app", tags.globals)}
         {renderTagList("El resto", tags.rest)}
      </BasicScreenContainer>
   );
};

const styles: Styles = StyleSheet.create({
   title: {
      marginTop: 20,
      marginBottom: 25,
      paddingLeft: 10,
      paddingRight: 10,
      textAlign: "center"
   }
});
