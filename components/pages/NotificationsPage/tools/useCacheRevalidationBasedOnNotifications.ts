import { useEffect } from "react";
import { revalidate } from "../../../../api/tools/useCache";
import { useUserGroupList } from "./../../../../api/server/groups";
import {
   Notification,
   NotificationType
} from "./../../../../api/server/shared-tools/endpoints-interfaces/user";

export function useCacheRevalidationBasedOnNotifications(notifications: Notification[]): void {
   const { data: groupList } = useUserGroupList();

   useEffect(() => {
      if (notifications == null || groupList == null) {
         return;
      }

      let revalidateGroupList: boolean = false;

      notifications.forEach(notification => {
         if (notification.type === NotificationType.Group) {
            if (groupList.find(group => group.groupId === notification.targetId) == null) {
               revalidateGroupList = true;
            }
         }
      });

      if (revalidateGroupList) {
         revalidate("user/groups");
      }
   }, [notifications, groupList]);
}
