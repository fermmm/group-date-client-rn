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
import BubbleAnimation from "./tools/BubbleAnimation";

export interface PropsBubble {
   messageData: ChatMessageProps;
   compact?: boolean;
   showAvatar?: boolean;
   showDate?: boolean;
   selected?: boolean;
   highlighted?: boolean;
   onPress?: () => void;
   onReplyPreviewPress?: (messageData: ChatMessageProps) => void;
   onAvatarPress?: () => void;
   style?: StyleProp<ViewStyle>;
   bubbleStyle?: StyleProp<ViewStyle>;
   showResponsePreview?: boolean;
   extraDarkBackground?: boolean;
   ownMessageBubbleColor?: string;
   ownMessageNameColor?: string;
   externalMessageBubbleColor?: string;
   maxLines?: number;
}

const Bubble: FC<PropsBubble> = props => {
   const {
      messageData,
      compact,
      selected,
      highlighted,
      onPress,
      onReplyPreviewPress,
      onAvatarPress,
      showAvatar = true,
      showDate = true,
      showResponsePreview = true,
      extraDarkBackground = false,
      ownMessageBubbleColor,
      ownMessageNameColor,
      externalMessageBubbleColor,
      maxLines
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
   const finalBubbleColor =
      isOwnMessage && ownMessageBubbleColor
         ? ownMessageBubbleColor
         : !isOwnMessage && externalMessageBubbleColor
         ? externalMessageBubbleColor
         : bubbleColor;
   const finalNameColor = isOwnMessage && ownMessageNameColor ? ownMessageNameColor : nameColor;

   return (
      <ViewTouchable style={styles.touchableContainer} onPress={onPress} onLongPress={onPress}>
         <BubbleAnimation
            animateHighlight={highlighted}
            highlightColor={"grey"}
            style={[
               styles.messageContainer,
               !avatarCanBeDisplayed && styles.messageContainerWithoutAvatar,
               isOwnMessage && styles.messageContainerOwnMessage,
               isOwnMessage && compact && styles.messageContainerOwnMessageAgain,
               selected && styles.messageContainerSelected,
               props.style
            ]}
         >
            {avatarCanBeDisplayed && (
               <Avatar size={48} source={messageData.avatar} onPress={onAvatarPress} />
            )}
            <View
               style={[
                  styles.bubble,
                  avatarCanBeDisplayed ? styles.bubbleWithAvatar : styles.bubbleWithoutAvatar,
                  { backgroundColor: finalBubbleColor },
                  extraDarkBackground && {
                     backgroundColor: color(finalBubbleColor).darken(0.2).toString()
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
                     onPress={() => onReplyPreviewPress(respondingToMessage)}
                     onReplyPreviewPress={messageData => onReplyPreviewPress(messageData)}
                     ownMessageBubbleColor={ownMessageBubbleColor}
                     ownMessageNameColor={ownMessageNameColor}
                     externalMessageBubbleColor={externalMessageBubbleColor}
                  />
               )}
               {authorName != null && (!compact || respondingToMessage != null) && (
                  <Text style={[styles.nameText, { color: finalNameColor }]}>{authorName}</Text>
               )}
               {textContent && (
                  <Text
                     style={[styles.textContent, { color: textColor }]}
                     numberOfLines={maxLines || undefined}
                     ellipsizeMode="tail"
                  >
                     {textContent}
                  </Text>
               )}
               {time != null && !compact && showDate && (
                  <Text style={[styles.timeText, { color: finalNameColor }]}>
                     {humanizeUnixTime(moment().unix() - time)}
                  </Text>
               )}
            </View>
         </BubbleAnimation>
      </ViewTouchable>
   );
};

const bubblesBorderRadius = 17;
const messagesSeparation = 18;
const messagesSeparationSameAuthor = 2;
const authorSideMargin = 50;

const styles: Styles = StyleSheet.create({
   touchableContainer: {
      borderRadius: 0
   },
   messageContainer: {
      flexDirection: "row",
      alignItems: "flex-end",
      marginTop: messagesSeparation,
      marginRight: 10,
      marginLeft: 10,
      borderRadius: bubblesBorderRadius,
      borderBottomRightRadius: bubblesBorderRadius // For some reason this is needed to make the border radius appear
   },
   messageContainerWithoutAvatar: {
      marginTop: messagesSeparationSameAuthor
   },
   messageContainerOwnMessage: {
      justifyContent: "flex-end",
      borderBottomRightRadius: 0
   },
   messageContainerOwnMessageAgain: {
      marginTop: messagesSeparationSameAuthor
   },
   messageContainerSelected: {
      backgroundColor: currentTheme.colors.primary
   },
   messageContainerHighlighted: {
      backgroundColor: currentTheme.colors.notification
   },
   bubble: {
      flexDirection: "column",
      flexShrink: 1,
      alignSelf: "flex-start",
      padding: 12,
      borderRadius: bubblesBorderRadius,
      marginRight: authorSideMargin
   },
   bubbleWithAvatar: {
      marginLeft: 10,
      borderBottomLeftRadius: 0
   },
   bubbleWithoutAvatar: {
      marginLeft: 25,
      borderTopLeftRadius: 0
   },
   bubbleOwnMessage: {
      marginRight: 0,
      marginLeft: authorSideMargin,
      borderTopLeftRadius: bubblesBorderRadius,
      borderBottomRightRadius: 0
   },
   nameText: {
      fontFamily: currentTheme.font.semiBold,
      fontSize: 13,
      marginBottom: 2,
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
