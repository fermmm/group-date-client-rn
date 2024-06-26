import moment from "moment";
import { Group, Slot } from "../../../../api/server/shared-tools/endpoints-interfaces/groups";
import { ServerInfoResponse } from "../../../../api/server/shared-tools/endpoints-interfaces/server-info";
import { humanizeUnixTime } from "../../../../common-tools/strings/humanizeUnixTime";

export function getSlotStatusInfoText(
   serverInfo: ServerInfoResponse,
   groups: Group[]
): string | null {
   if (serverInfo == null || groups == null) {
      return null;
   }

   let result: string = null;
   const slots = [...serverInfo.serverConfigurations.groupSlots];

   slots.forEach(slot => {
      const groupsOfSlot = getGroupsOfSlot(slot, groups);

      if (groupsOfSlot.length >= slot.amount) {
         const creationDate = Math.min(...groupsOfSlot.map(g => g.creationDate));
         const timeSinceGroupCreated = moment().unix() - creationDate;
         const releaseTimeLeft = slot.releaseTime - timeSinceGroupCreated;

         result = `Se permite ${slot.amount} grupo${
            slot.amount > 1 ? "s" : ""
         } al mismo tiempo, dentro de ${humanizeUnixTime(
            releaseTimeLeft
         )} podrás tener uno nuevo. Si se forma uno muy grande se ignora la restricción.`;
      }
   });

   return result;
}

function getGroupsOfSlot(slot: Slot, groups: Group[]): Group[] {
   return groups.filter(group => {
      if (group.creationDate < moment().unix() - slot.releaseTime) {
         return false;
      }

      if (group.membersAmount < slot.minimumSize ?? 0) {
         return false;
      }

      if (group.membersAmount > slot.maximumSize ?? Number.MAX_SAFE_INTEGER) {
         return false;
      }

      return true;
   });
}
