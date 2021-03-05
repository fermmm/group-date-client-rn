import React, { FC } from "react";
import { View, StyleSheet } from "react-native";
import { useThemes } from "../../../api/server/themes";
import { useTheme } from "../../../common-tools/themes/useTheme/useTheme";
import BasicScreenContainer from "../../common/BasicScreenContainer/BasicScreenContainer";
import { LoadingAnimation, RenderMethod } from "../../common/LoadingAnimation/LoadingAnimation";
import { ViewTouchable } from "../../common/ViewTouchable/ViewTouchable";
import { Styles } from "../../../common-tools/ts-tools/Styles";
import ThemeChip from "../../common/ProfileCard/QuestionInProfileCard/QuestionInProfileCard";

export const ThemesPage: FC = () => {
   // Sorry for this almost name collision of unrelated things
   const { data: themes } = useThemes();
   const { colors } = useTheme();

   if (!themes) {
      return <LoadingAnimation renderMethod={RenderMethod.FullScreen} />;
   }

   return (
      <BasicScreenContainer>
         <View>
            {themes.map(theme => (
               <ViewTouchable
                  onPress={() => console.log("Pressed")}
                  key={theme.themeId}
                  style={styles.themeContainer}
               >
                  <ThemeChip theme={theme} />
               </ViewTouchable>
            ))}
         </View>
      </BasicScreenContainer>
   );
};

const styles: Styles = StyleSheet.create({
   themeContainer: {}
});
