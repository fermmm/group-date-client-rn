import React, { FC } from "react";
import { View, StyleSheet } from "react-native";
import { useTags } from "../../../api/server/tags";
import { useTheme } from "../../../common-tools/themes/useTheme/useTheme";
import BasicScreenContainer from "../../common/BasicScreenContainer/BasicScreenContainer";
import { LoadingAnimation, RenderMethod } from "../../common/LoadingAnimation/LoadingAnimation";
import { ViewTouchable } from "../../common/ViewTouchable/ViewTouchable";
import { Styles } from "../../../common-tools/ts-tools/Styles";
import TagChip from "../../common/ProfileCard/QuestionInProfileCard/QuestionInProfileCard";

export const TagsPage: FC = () => {
   const { data: tags } = useTags();
   const { colors } = useTheme();

   if (!tags) {
      return <LoadingAnimation renderMethod={RenderMethod.FullScreen} />;
   }

   return (
      <BasicScreenContainer>
         <View>
            {tags.map(tag => (
               <ViewTouchable
                  onPress={() => console.log("Pressed")}
                  key={tag.tagId}
                  style={styles.tagContainer}
               >
                  <TagChip tag={tag} />
               </ViewTouchable>
            ))}
         </View>
      </BasicScreenContainer>
   );
};

const styles: Styles = StyleSheet.create({
   tagContainer: {}
});
