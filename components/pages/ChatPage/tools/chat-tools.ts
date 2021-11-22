import { ChatMessage } from "../../../../api/server/shared-tools/endpoints-interfaces/common";
import { Group } from "../../../../api/server/shared-tools/endpoints-interfaces/groups";

export const getColorForUser = (
   userId: string,
   group: Group,
   colors: string[],
   defaultColor = "black"
) => {
   const memberIndex = group.members.findIndex(m => m.userId === userId);
   return colors[memberIndex] ?? defaultColor;
};

export const getUnknownUsersFromChat = (group: Group, updatedChat: ChatMessage[]): string[] => {
   const result: string[] = [];

   if (group == null || updatedChat == null) {
      return result;
   }

   const groupMembers = new Set<string>();
   group.members.forEach(member => groupMembers.add(member.userId));
   updatedChat.forEach(message => {
      if (!groupMembers.has(message.authorUserId)) {
         result.push(message.authorUserId);
      }
   });
   return result;
};
