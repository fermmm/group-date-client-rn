import { useNavigation } from "@react-navigation/native";
import React, { FC, useMemo, useState } from "react";
import { View, StyleSheet } from "react-native";
import { Button } from "react-native-paper";
import { Tag } from "../../../../api/server/shared-tools/endpoints-interfaces/tags";
import { sendTags, TagEditAction } from "../../../../api/server/tags";
import { useUser } from "../../../../api/server/user";
import { useFacebookToken } from "../../../../api/third-party/facebook/facebook-login";
import { useTheme } from "../../../../common-tools/themes/useTheme/useTheme";
import { Styles } from "../../../../common-tools/ts-tools/Styles";
import { currentTheme } from "../../../../config";
import { CardsSource } from "../../../pages/CardsPage/CardsPage";
import { LoadingAnimation } from "../../LoadingAnimation/LoadingAnimation";
import { ModalTransparent } from "../../ModalTransparent/ModalTransparent";
import TagChip from "../TagChip";

interface TagPressModalProps {
   tag: Tag;
   onClose: () => void;
}

export const TagPressModal: FC<TagPressModalProps> = ({ tag, onClose }) => {
   const [loading, setLoading] = useState(false);
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

   const handleSubscribePress = async () => {
      setLoading(true);
      await sendTags({
         action: !isSubscribed ? TagEditAction.Subscribe : TagEditAction.RemoveSubscription,
         tagIds: [tag.tagId],
         token
      });
      setLoading(false);
      onClose();
   };

   const handleNavigatePress = () => {
      onClose();
      navigate("Cards", {
         specialCardsSource: CardsSource.Tag,
         tagId: tag.tagId
      });
   };

   const handleHidePress = async () => {
      setLoading(true);
      await sendTags({
         action: !isBlocking ? TagEditAction.Block : TagEditAction.RemoveBlock,
         tagIds: [tag.tagId],
         token
      });
      setLoading(false);
      onClose();
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
                        showSubscribersAmount
                        userSubscribed={isSubscribed}
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
