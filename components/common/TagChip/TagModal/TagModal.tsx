import { useNavigation } from "@react-navigation/native";
import React, { FC, useMemo } from "react";
import { View, StyleSheet, Alert } from "react-native";
import { Button } from "react-native-paper";
import { Tag } from "../../../../api/server/shared-tools/endpoints-interfaces/tags";
import { sendTags, TagEditAction } from "../../../../api/server/tags";
import { useUser } from "../../../../api/server/user";
import { useFacebookToken } from "../../../../api/third-party/facebook/facebook-login";
import { useTheme } from "../../../../common-tools/themes/useTheme/useTheme";
import { Styles } from "../../../../common-tools/ts-tools/Styles";
import { currentTheme } from "../../../../config";
import { CardsSource } from "../../../pages/CardsPage/tools/types";
import { LoadingAnimation } from "../../LoadingAnimation/LoadingAnimation";
import { ModalTransparent } from "../../ModalTransparent/ModalTransparent";
import TagChip from "../TagChip";

interface TagModalProps {
   tag: Tag;
   onClose: () => void;
   showSubscribersAmount?: boolean;
   hideCategory?: boolean;
}

export const TagModal: FC<TagModalProps> = props => {
   const { tag, onClose, showSubscribersAmount, hideCategory } = props;
   const { colors } = useTheme();
   const { navigate } = useNavigation();
   const { data: user } = useUser();
   const { token } = useFacebookToken(user?.token);
   const isSubscribed = useMemo(
      () => user?.tagsSubscribed?.find(t => t.tagId === tag.tagId) != null,
      [user]
   );
   const isBlocking = useMemo(() => user?.tagsBlocked?.find(t => t.tagId === tag.tagId) != null, [
      user
   ]);
   const loading = user == null;

   const handleSubscribePress = () => {
      sendTags({
         action: !isSubscribed ? TagEditAction.Subscribe : TagEditAction.RemoveSubscription,
         tagIds: [tag.tagId],
         token
      });
      onClose();
   };

   const handleNavigatePress = () => {
      onClose();
      navigate("Cards", {
         cardsSource: CardsSource.Tag,
         tagId: tag.tagId,
         tagName: tag.name
      });
   };

   const handleHidePress = () => {
      if (isBlocking) {
         sendTags({
            action: TagEditAction.RemoveBlock,
            tagIds: [tag.tagId],
            token
         });
         onClose();
         return;
      }

      Alert.alert(
         "",
         "¿Estas segurx?. Verás menos usuarios en la app, recomendamos usar esto solo si lo consideras realmente necesario",
         [
            { text: "Cancelar" },
            {
               text: "Ocultar",
               onPress: () => {
                  sendTags({
                     action: TagEditAction.Block,
                     tagIds: [tag.tagId],
                     token
                  });
                  onClose();
               }
            }
         ]
      );
   };

   return (
      <ModalTransparent onClose={onClose}>
         <View style={[styles.mainContainer, !loading ? { paddingBottom: 25 } : null]}>
            {loading ? (
               <LoadingAnimation />
            ) : (
               <>
                  <View style={styles.tagContainer}>
                     <TagChip
                        tag={tag}
                        interactive={false}
                        showSubscribersAmount={showSubscribersAmount}
                        userSubscribed={isSubscribed}
                        userBlocked={isBlocking}
                        hideCategory={hideCategory}
                     />
                  </View>
                  <Button
                     mode="text"
                     compact
                     uppercase={false}
                     color={colors.text}
                     style={styles.button}
                     onPress={handleSubscribePress}
                  >
                     {!isSubscribed ? "Suscribirme" : "Quitar suscripción"}
                  </Button>
                  <Button
                     mode="text"
                     compact
                     uppercase={false}
                     color={colors.text}
                     style={styles.button}
                     onPress={handleNavigatePress}
                  >
                     Navegar subscriptores
                  </Button>
                  <Button
                     mode="text"
                     compact
                     uppercase={false}
                     color={colors.text}
                     style={styles.button}
                     onPress={handleHidePress}
                  >
                     {!isBlocking ? "Ocultar subscriptores" : "Dejar de ocultar subscriptores"}
                  </Button>
               </>
            )}
         </View>
      </ModalTransparent>
   );
};

const styles: Styles = StyleSheet.create({
   mainContainer: {
      width: "90%",
      backgroundColor: currentTheme.colors.background,
      borderRadius: currentTheme.roundnessSmall
   },
   tagContainer: {
      alignItems: "center",
      justifyContent: "center",
      paddingTop: 25,
      paddingBottom: 25
   }
});
