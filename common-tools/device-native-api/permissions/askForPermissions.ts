import { useEffect, useRef, useState } from "react";
import { PermissionResponse } from "expo-modules-core";
import {
   showRejectedPermissionsDialog,
   RejectedDialogSettings
} from "./dialogRejectedPermissions/dialogRejectedPermissions";

/**
 * Ask the user for a permission, shows error dialogs when the user rejects permission, the dialog offers the user
 * to go to permission settings of the app and enable permissions from there.
 * The Promise of this function is resolved when the user enabled the permissions by clicking allow, by
 * going to the permission settings or when the permissions were already granted.
 * Also the promise resolves if the user already granted the permissions in the past.
 * To change dialog texts use the settings parameter.
 * Official info about this flow in the following video: https://youtu.be/iZqDdvhTZj0?list=PLWz5rJ2EKKc-YUddw59dYq61o3ynn3A4X&t=283
 * @param permissionsSource An object with a getter and requester: {getter: () => Location.getPermissionsAsync(), requester: () => Location.requestPermissionsAsync()}
 * @param settings Use this parameter to disable dialogs or change dialogs texts.
 */
export function usePermission(
   permissionSource: PermissionSource,
   settings?: AskPermissionSettings & { enabled?: boolean }
) {
   const [granted, setGranted] = useState(false);
   const mounted = useRef(true);
   const { enabled = true } = settings ?? {};
   useEffect(() => {
      if (!enabled) {
         return;
      }

      if (!granted) {
         askForPermission(permissionSource, settings).then(() => {
            if (mounted.current) {
               setGranted(true);
            }
         });
      }
      return () => {
         mounted.current = false;
      };
   }, [enabled, granted]);
   return granted;
}

/**
 * Ask the user for a permission, shows error dialogs when the user rejects permission: this dialog offers the user
 * to go to permission settings of the app and enable permissions from there.
 * The Promise of this function is resolved when the user enabled the permissions by clicking allow, by
 * going to the permission settings or when the permissions were already granted.
 * Also the promise resolves if the user already granted the permissions in the past.
 * To change dialog texts use the settings parameter.
 * Official info about this flow in the following video: https://youtu.be/iZqDdvhTZj0?list=PLWz5rJ2EKKc-YUddw59dYq61o3ynn3A4X&t=283
 * @param permissionsSource An object with a getter and requester: {getter: () => Location.getPermissionsAsync(), requester: () => Location.requestPermissionsAsync()}
 * @param settings Use this parameter to disable dialogs or change dialogs texts.
 */
export async function askForPermission(
   permissionsSource: PermissionSource,
   settings?: AskPermissionSettings
): Promise<void> {
   const {
      allowContinueWithoutAccepting = false,
      rejectedDialogTexts = {},
      permissionName
   } = settings ?? {};

   let result: PermissionResponse = await permissionsSource.getter();

   if (result.status !== "granted") {
      result = await permissionsSource.requester();
   }

   if (result.status !== "granted") {
      if (allowContinueWithoutAccepting) {
         return Promise.resolve();
      }
      await showRejectedPermissionsDialog({ ...rejectedDialogTexts, permissionName });
      return askForPermission(permissionsSource, settings);
   }

   return Promise.resolve();
}

export interface AskPermissionSettings {
   /**
    * Default = false. If false shows a dialog asking the user to enable permissions.
    */
   allowContinueWithoutAccepting?: boolean;
   /**
    * Default = {}. Texts to show in the permissions rejected error dialog, if this is not set then english generic texts are used
    */
   rejectedDialogTexts?: RejectedDialogSettings;
   /**
    * Default = undefined. Permission name to show in the permissions rejected error dialog, if this is not set then the texts adapts to communicate the issue without specifying the permission name.
    */
   permissionName?: string;
}

export interface PermissionSource {
   getter: () => Promise<PermissionResponse>;
   requester: () => Promise<PermissionResponse>;
}
