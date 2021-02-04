import I18n from "i18n-js";
import moment from "moment";
import { Group, Slot } from "../../../../api/server/shared-tools/endpoints-interfaces/groups";
import { ServerInfoResponse } from "../../../../api/server/shared-tools/endpoints-interfaces/server-info";

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
         result = `Se permite ${slot.amount} cita${
            slot.amount > 1 ? "s" : ""
         } al mismo tiempo, dentro de ${moment
            .duration(slot.releaseTime, "seconds")
            .locale(I18n.locale)
            .humanize()} podrás tener una nueva. Si se forma una cita grande se ignora la restricción.`;
      }
   });

   return result;
}

function getGroupsOfSlot(slot: Slot, groups: Group[]): Group[] {
   return groups.filter(group => {
      if (group.creationDate < moment().unix() - slot.releaseTime) {
         return false;
      }

      if (group.members.length < slot.minimumSize ?? 0) {
         return false;
      }

      if (group.members.length > slot.maximumSize ?? Number.MAX_SAFE_INTEGER) {
         return false;
      }

      return true;
   });
}
