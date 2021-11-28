import color from "color";
import React, { FC } from "react";
import { StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useTheme } from "../../../../../common-tools/themes/useTheme/useTheme";
import { Styles } from "../../../../../common-tools/ts-tools/Styles";
import { ViewTouchable } from "../../../ViewTouchable/ViewTouchable";
import Bubble from "../../Bubble/Bubble";
import { ChatMessageProps } from "../../Chat";

interface PropsRespondPreview {
   respondingToMessage?: ChatMessageProps;
   onRemoveReply: () => void;
}
const RespondPreview: FC<PropsRespondPreview> = props => {
   const { respondingToMessage, onRemoveReply } = props;
   const { colors } = useTheme();

   if (respondingToMessage == null) {
      return null;
   }

   return (
      <View style={styles.mainContainer}>
         <Text style={styles.titleText}>Responder</Text>
         <View style={styles.bubbleContainer}>
            <ViewTouchable onPress={onRemoveReply}>
               <Icon name={"close"} color={colors.accent2} size={25} />
            </ViewTouchable>
            <Bubble
               style={styles.replyContainer}
               bubbleStyle={styles.replyBubble}
               messageData={respondingToMessage}
               showResponsePreview={false}
               showAvatar={false}
               showDate={false}
            />
         </View>
      </View>
   );
};

const styles: Styles = StyleSheet.create({
   mainContainer: {
      flexDirection: "column",
      marginTop: 8,
      borderTopWidth: 1,
      borderTopColor: color("white").darken(0.3).toString()
   },
   titleText: {
      fontSize: 14,
      paddingLeft: 14,
      marginBottom: 10,
      marginTop: 10
   },
   bubbleContainer: {
      flexDirection: "row",
      alignItems: "flex-start",
      marginLeft: 10
   },
   replyContainer: {
      justifyContent: "flex-start",
      paddingLeft: 0,
      width: "100%",
      marginTop: 0
   },
   replyBubble: {
      opacity: 0.8,
      marginTop: 0
   }
});

export default RespondPreview;
