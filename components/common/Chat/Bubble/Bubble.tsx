import color from "color";
import moment from "moment";
import React, { FC } from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { Text } from "react-native-paper";
import { humanizeUnixTime } from "../../../../common-tools/strings/humanizeUnixTime";
import { Styles } from "../../../../common-tools/ts-tools/Styles";
import { currentTheme } from "../../../../config";
import Avatar from "../../Avatar/Avatar";
import { ViewTouchable } from "../../ViewTouchable/ViewTouchable";
import { ChatMessageProps } from "../Chat";

export interface PropsBubble {
   messageData: ChatMessageProps;
   compact?: boolean;
   showAvatar?: boolean;
   showDate?: boolean;
   selected?: boolean;
   onPress?: () => void;
   onReplyPress?: (messageData: ChatMessageProps) => void;
   style?: StyleProp<ViewStyle>;
   bubbleStyle?: StyleProp<ViewStyle>;
   showResponsePreview?: boolean;
   extraDarkBackground?: boolean;
}

const Bubble: FC<PropsBubble> = props => {
   const {
      messageData,
      compact,
      selected,
      onPress,
      onReplyPress,
      showAvatar = true,
      showDate = true,
      showResponsePreview = true,
      extraDarkBackground = false
   } = props;
   const {
      authorName,
      avatar,
      textContent,
      textColor = "white",
      nameColor = "white",
      bubbleColor,
      isOwnMessage,
      time,
      respondingToMessage
   } = messageData;

   const avatarCanBeDisplayed = avatar && showAvatar;

   return (
      <ViewTouchable
         style={[
            styles.messageContainer,
            !avatarCanBeDisplayed && styles.messageContainerWithoutAvatar,
            isOwnMessage && styles.messageContainerOwnMessage,
            isOwnMessage && compact && styles.messageContainerOwnMessageAgain,
            selected && styles.messageContainerSelected,
            props.style
         ]}
         onPress={onPress}
         onLongPress={onPress}
      >
         <>
            {avatarCanBeDisplayed && <Avatar size={48} source={messageData.avatar} />}
            <View
               style={[
                  styles.bubble,
                  avatarCanBeDisplayed ? styles.bubbleWithAvatar : styles.bubbleWithoutAvatar,
                  { backgroundColor: bubbleColor },
                  extraDarkBackground && {
                     backgroundColor: color(bubbleColor).darken(0.2).toString()
                  },
                  isOwnMessage && styles.bubbleOwnMessage,
                  props.bubbleStyle
               ]}
            >
               {showResponsePreview && respondingToMessage != null && (
                  <Bubble
                     style={styles.replyPreviewBubbleContainer}
                     bubbleStyle={styles.replyPreviewBubble}
                     messageData={respondingToMessage}
                     showAvatar={false} // If this is set as true it works but looks too overcharged
                     compact={false}
                     showDate={false}
                     extraDarkBackground
                     showResponsePreview={false} // Setting this to true shows the whole history of responses inside a single message, but clicking to follow the conversation scales better
                     onPress={() => onReplyPress(respondingToMessage)}
                     onReplyPress={messageData => onReplyPress(messageData)}
                  />
               )}
               {authorName != null && (!compact || respondingToMessage != null) && (
                  <Text style={[styles.nameText, { color: nameColor }]}>{authorName}</Text>
               )}
               {textContent && (
                  <Text style={[styles.textContent, { color: textColor }]}>{textContent}</Text>
               )}
               {time != null && !compact && showDate && (
                  <Text style={[styles.timeText, { color: nameColor }]}>
                     {humanizeUnixTime(moment().unix() - time)}
                  </Text>
               )}
            </View>
         </>
      </ViewTouchable>
   );
};

const bubblesBorderRadius = 17;
const messagesSeparation = 18;
const messagesSeparationSameAuthor = 2;

const styles: Styles = StyleSheet.create({
   messageContainer: {
      flexDirection: "row",
      alignItems: "flex-end",
      marginTop: messagesSeparation,
      paddingLeft: 10,
      paddingRight: 10
   },
   messageContainerWithoutAvatar: {
      marginTop: messagesSeparationSameAuthor
   },
   messageContainerOwnMessage: {
      justifyContent: "flex-end"
   },
   messageContainerOwnMessageAgain: {
      marginTop: messagesSeparationSameAuthor
   },
   messageContainerSelected: {
      backgroundColor: currentTheme.colors.primary
   },
   bubble: {
      flexDirection: "column",
      flexShrink: 1,
      alignSelf: "flex-start",
      padding: 12,
      borderRadius: bubblesBorderRadius,
      marginLeft: 10
   },
   bubbleWithAvatar: {
      borderBottomLeftRadius: 0
   },
   bubbleWithoutAvatar: {
      marginLeft: 25,
      borderTopLeftRadius: 0
   },
   bubbleOwnMessage: {
      borderTopLeftRadius: bubblesBorderRadius,
      borderBottomRightRadius: 0
   },
   nameText: {
      fontFamily: currentTheme.font.semiBold,
      fontSize: 10,
      alignSelf: "flex-start"
   },
   textContent: {
      fontFamily: currentTheme.font.regular,
      fontSize: 14,
      alignSelf: "flex-start",
      letterSpacing: 0.1,
      lineHeight: 18
   },
   timeText: {
      fontFamily: currentTheme.font.regular,
      fontSize: 9,
      alignSelf: "flex-end",
      marginTop: 2
   },
   replyPreviewBubbleContainer: {
      paddingLeft: 0,
      paddingRight: 0,
      marginTop: 0,
      marginBottom: 10
   },
   replyPreviewBubble: {
      marginLeft: 0
   }
});

export default Bubble;
