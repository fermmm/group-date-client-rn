import { useLocalStorage } from "../../../../common-tools/device-native-api/storage/useLocalStorage";
import { ChatMessage } from "../../../../api/server/shared-tools/endpoints-interfaces/common";

export function useUnreadMessagesCount(
   groupId: string,
   messages: ChatMessage[]
): UseStoredChatHistory {
   const stored = useLocalStorage("lastMessageRead" + groupId, false);

   const lastReadMessageIndex =
      messages?.findIndex(msg => msg.chatMessageId === stored.value) ?? -1;

   let unreadCount =
      lastReadMessageIndex !== -1 && messages != null
         ? messages.length - lastReadMessageIndex - 1
         : messages?.length ?? 0;

   if (stored.isLoading) {
      unreadCount = 0;
   }

   return {
      isLoading: stored.isLoading,
      count: unreadCount,
      setAsRead: newChat =>
         newChat?.length > 0 && stored.setValue(newChat[newChat.length - 1].chatMessageId),
      refresh: stored.refresh
   };
}

export interface UseStoredChatHistory {
   isLoading: boolean;
   count: number;
   setAsRead: (newChat: ChatMessage[]) => void;
   refresh: () => void;
}
