import React, { FC, useCallback, useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { Text } from "react-native-paper";
import { Styles } from "../../../common-tools/ts-tools/Styles";
import { GiftedChat, Bubble, Send, IMessage } from "react-native-gifted-chat";
import AppBarHeader from "../../common/AppBarHeader/AppBarHeader";
import Dialog from "../../common/Dialog/Dialog";
import { useFocusEffect, useRoute } from "@react-navigation/native";
import { HelpBanner } from "../../common/HelpBanner/HelpBanner";
import { RouteProps } from "../../../common-tools/ts-tools/router-tools";
import { useTheme } from "../../../common-tools/themes/useTheme/useTheme";
import { PageBackgroundGradient } from "../../common/PageBackgroundGradient/PageBackgroundGradient";
import I18n from "i18n-js";
import { CHAT_REFRESH_INTERVAL } from "../../../config";
import { sendChatMessage, useChat, useGroup } from "../../../api/server/groups";
import moment from "moment";
import { getGroupMember } from "../../../api/tools/groupTools";
import { useUser } from "../../../api/server/user";
import { useAuthentication } from "../../../api/authentication/useAuthentication";
import color from "color";
import Avatar from "../../common/Avatar/Avatar";
import { revalidate } from "../../../api/tools/useCache/useCache";
import { LoadingAnimation, RenderMethod } from "../../common/LoadingAnimation/LoadingAnimation";
import { getColorForUser, getUnknownUsersFromChat } from "./tools/chat-tools";
import { stringIsEmptyOrSpacesOnly } from "../../../common-tools/js-tools/js-tools";
import { useGoBackExtended } from "../../../common-tools/navigation/useGoBackExtended";

export interface ChatPageState {
   messages: IMessage[];
   adviseBannerVisible: boolean;
   isContactChat: boolean;
   showIntroDialog: boolean;
   introDialogText: string;
}
interface ParamsChat {
   groupId?: string;
   contactChat?: boolean;
   introDialogText?: string;
}

const ChatPage: FC = () => {
   const { colors, font, chatNamesColors } = useTheme();
   const { params } = useRoute<RouteProps<ParamsChat>>();
   const [messages, setMessages] = useState<IMessage[]>([]);
   const [showIntroDialog, setShowIntroDialog] = useState(params?.introDialogText != null);
   const isContactChat = params?.contactChat ?? false;
   const { token } = useAuthentication();
   const { data: user } = useUser();
   const { data: group } = useGroup({
      groupId: params?.groupId,
      config: { enabled: !isContactChat }
   });
   const { data: groupChatFromServer } = useChat({
      groupId: params?.groupId,
      config: {
         refreshInterval: CHAT_REFRESH_INTERVAL,
         enabled: !isContactChat
      }
   });
   const { goBack } = useGoBackExtended({
      whenBackNotAvailable: { goToRoute: "Group", params: { groupId: params?.groupId } }
   });
   const isLoading: boolean = group == null || user == null;

   useFocusEffect(
      useCallback(() => {
         revalidate("group/chat" + params?.groupId);
      }, [])
   );

   useEffect(() => {
      if (groupChatFromServer == null || groupChatFromServer.messages == null) {
         return;
      }

      setMessages(
         groupChatFromServer.messages
            ?.map(message => {
               const usr = getGroupMember(message.authorUserId, group);
               return {
                  _id: message.chatMessageId,
                  text: message.messageText,
                  createdAt: moment(message.time, "X").toDate(),
                  user: {
                     _id: message.authorUserId,
                     name: usr?.name,
                     avatar: usr?.images?.[0]
                  }
               };
            })
            .reverse() ?? []
      );

      if (getUnknownUsersFromChat(group, groupChatFromServer.messages).length > 0) {
         revalidate("group" + params?.groupId);
      }
   }, [groupChatFromServer, group]);

   const handleSend = useCallback(
      (messages: IMessage[] = []) => {
         const msg = messages[0];

         if (msg?.text == null) {
            return;
         }

         if (stringIsEmptyOrSpacesOnly(msg?.text)) {
            return;
         }

         setMessages(previousMessages =>
            GiftedChat.append(previousMessages, [{ ...msg, pending: true }])
         );
         sendChatMessage({ token, groupId: group.groupId, message: messages[0].text });
      },
      [group?.groupId]
   );

   if (isContactChat) {
      return (
         <>
            <AppBarHeader title={!isContactChat ? "" : "Contáctanos"} onBackPress={goBack} />
            <PageBackgroundGradient>
               <Text style={{ padding: 45, fontSize: 20 }}>Sección sin terminar =(</Text>
            </PageBackgroundGradient>
         </>
      );
   }

   if (isLoading) {
      return <LoadingAnimation renderMethod={RenderMethod.FullScreen} />;
   }

   return (
      <>
         <AppBarHeader title={!isContactChat ? "" : "Contáctanos"} onBackPress={goBack} />
         <PageBackgroundGradient>
            {/* Tal vez este mensaje condiciona a los usuarios implantándoles una realidad en su mente que tal vez nunca suceda*/}
            {/* 
               !isContactChat && (
                  <HelpBanner
                     showCloseButton
                     animate={false}
                     text={
                        "Concejo: El medio escrito desmotiva a socializar en persona, es mejor usarlo con moderación."
                     }
                     rememberClose={true}
                     rememberCloseTimeInSeconds={DAY_IN_SECONDS * 3}
                  />
               )
            */}

            <GiftedChat
               messages={messages}
               onSend={messages => handleSend(messages)}
               user={{
                  _id: user.userId
               }}
               renderUsernameOnMessage={true}
               alwaysShowSend
               placeholder={"Escribir un mensaje..."}
               renderAvatar={props => {
                  return (
                     <Avatar
                        size={48}
                        source={{ uri: props.currentMessage.user.avatar as string }}
                     />
                  );
               }}
               renderBubble={props => (
                  <Bubble
                     {...props}
                     renderTime={() => null}
                     renderTicks={() => null}
                     textStyle={{
                        right: {
                           color: colors.text2,
                           fontFamily: font.regular,
                           fontSize: 14
                        },
                        left: {
                           color: colors.text2,
                           fontFamily: font.regular,
                           fontSize: 14
                        }
                     }}
                     usernameStyle={{
                        color: color(
                           getColorForUser(
                              props.currentMessage.user._id as string,
                              group,
                              chatNamesColors
                           )
                        )
                           .desaturate(0.3)
                           .lighten(0.3)
                           .toString(),
                        fontFamily: font.semiBold,
                        fontSize: 10
                     }}
                     wrapperStyle={{
                        right: {
                           backgroundColor: props.currentMessage.pending
                              ? color(colors.specialBackground1)
                                   .alpha(0.5)
                                   .desaturate(0.5)
                                   .toString()
                              : color(colors.specialBackground1)
                                   .darken(0.4)
                                   .desaturate(0.5)
                                   .toString(),
                           padding: 3
                        },
                        left: {
                           backgroundColor: color(
                              getColorForUser(
                                 props.currentMessage.user._id as string,
                                 group,
                                 chatNamesColors
                              )
                           )
                              .darken(0.4)
                              .desaturate(0.8)
                              .toString(),
                           padding: 3
                        }
                     }}
                  />
               )}
               // renderInputToolbar={() => null} // This will be required when remaking input toolbar
               renderSend={props => (
                  <Send {...props} label={"Enviar"} textStyle={{ color: colors.primary }} />
               )}
               keyboardShouldPersistTaps={"never"}
               maxInputLength={5000}
               locale={I18n.locale}
               scrollToBottom
               alignTop
            />
            <Dialog visible={showIntroDialog} onDismiss={() => setShowIntroDialog(false)}>
               {params?.introDialogText}
            </Dialog>
         </PageBackgroundGradient>
      </>
   );
};

const styles: Styles = StyleSheet.create({});

export default ChatPage;
