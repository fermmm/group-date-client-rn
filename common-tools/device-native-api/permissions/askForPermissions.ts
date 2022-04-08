import { useEffect, useRef, useState } from "react";
import { PermissionResponse } from "expo-modules-core";
import {
   showRejectedPermissionsDialog,
   RejectedDialogSettings
} from "./dialogRejectedPermissions/dialogRejectedPermissions";

/**
 * Ask the user for a permission, shows error dialogs when the user rejects permission, the dialog offers the user
 * to go to permission settings of the app and enable permissions from there.
 * If the permission is not yet determined it returns null.
 * To change dialog texts use the settings parameter.
 * Official info about this flow in the following video: https://youtu.be/iZqDdvhTZj0?list=PLWz5rJ2EKKc-YUddw59dYq61o3ynn3A4X&t=283
 * If you want to use a non-hook version of this code use askForPermission() instead.
 * @param permissionsSource An object with a getter and requester: {getter: () => Location.getPermissionsAsync(), requester: () => Location.requestPermissionsAsync()}
 * @param settings Use this parameter to disable dialogs or change dialogs texts.
 */
export function usePermission(
   permissionSource: PermissionSource,
   settings?: AskPermissionSettings & { enabled?: boolean }
) {
   const [granted, setGranted] = useState<boolean>(null);
   const mounted = useRef(true);
   const { enabled = true } = settings ?? {};

   useEffect(() => {
      if (!enabled) {
         return;
      }

      if (granted == null) {
         askForPermission(permissionSource, settings).then(nowGranted => {
            if (mounted.current) {
               setGranted(nowGranted);
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
): Promise<boolean> {
   const {
      allowContinueWithoutAccepting = false,
      insistOnAcceptingOnce = false,
      rejectedDialogTexts = {},
      permissionName
   } = settings ?? {};

   let result: PermissionResponse = await permissionsSource.getter();

   if (result.status !== "granted") {
      result = await permissionsSource.requester();
   }

   if (result.status !== "granted") {
      let dialogResponse = { retry: false };

      if (insistOnAcceptingOnce && allowContinueWithoutAccepting) {
         dialogResponse = await showRejectedPermissionsDialog({
            ...rejectedDialogTexts,
            permissionName,
            showContinueAnywayButton: true
         });

         if (dialogResponse.retry) {
            return askForPermission(permissionsSource, settings);
         }

         return Promise.resolve(false);
      }

      if (allowContinueWithoutAccepting) {
         return Promise.resolve(false);
      }

      await showRejectedPermissionsDialog({ ...rejectedDialogTexts, permissionName });
      return askForPermission(permissionsSource, settings);
   }

   return Promise.resolve(true);
}

export interface AskPermissionSettings {
   /**
    * Default = false. If false shows a dialog asking the user to enable permissions.
    */
   allowContinueWithoutAccepting?: boolean;
   /**
    * Default = false. If allowContinueWithoutAccepting is false this prop has no effect, otherwise it shows a dialog to insist to accept the permission once.
    */
   insistOnAcceptingOnce?: boolean;
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
