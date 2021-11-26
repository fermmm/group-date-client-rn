import React, { FC } from "react";
import { StyleSheet, View } from "react-native";
import { Styles } from "../../../../common-tools/ts-tools/Styles";
import AppBarHeader from "../../../common/AppBarHeader/AppBarHeader";
import ButtonForAppBar from "../../../common/ButtonForAppBar/ButtonForAppBar";
import { ChatMessageProps } from "../../../common/Chat/Chat";

interface ParamsChatAppBar {
   isContactChat: boolean;
   selectedMessage?: ChatMessageProps;
   onBackPress: () => void;
   onReplyPress: () => void;
   onCopyPress: () => void;
}

const ChatAppBar: FC<ParamsChatAppBar> = params => {
   const { onBackPress, onReplyPress, onCopyPress, isContactChat, selectedMessage } = params;

   return (
      <AppBarHeader title={!isContactChat ? "" : "Contáctanos"} onBackPress={onBackPress}>
         <View style={styles.buttonsContainer}>
            {selectedMessage && (
               <>
                  <ButtonForAppBar
                     icon="content-copy"
                     onPress={onCopyPress}
                     style={styles.buttonForAppBar}
                     labelStyle={styles.buttonForAppBarLabel}
                  />
                  <ButtonForAppBar
                     icon="reply"
                     onPress={onReplyPress}
                     style={styles.buttonForAppBar}
                     labelStyle={styles.buttonForAppBarLabel}
                  />
               </>
            )}
         </View>
      </AppBarHeader>
   );
};

const styles: Styles = StyleSheet.create({
   buttonsContainer: {
      flexDirection: "row"
   },
   buttonForAppBar: {
      marginLeft: 15
   },
   buttonForAppBarLabel: {
      marginRight: 0
   }
});

export default ChatAppBar;
