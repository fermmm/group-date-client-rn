import { useEffect, useRef, useState } from "react";
import * as Permissions from "expo-permissions";
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
 * @param permissionsSource The permission to ask, example: Permissions.LOCATION with this import: import * as Permissions from "expo-permissions"; Also can be an object with a getter and requester: {getter: () => Location.getPermissionsAsync(), requester: () => Location.requestPermissionsAsync()}
 * @param settings Use this parameter to disable dialogs or change dialogs texts.
 */
export function usePermission(
   permissionSource: PermissionSource,
   settings?: AskPermissionSettings
) {
   const [granted, setGranted] = useState(false);
   const mounted = useRef(true);
   useEffect(() => {
      if (!granted) {
         askForPermission(permissionSource, settings).then(() => {
            if (mounted.current) {
               setGranted(true);
            }
         });
      }
      return () => (mounted.current = false);
   }, []);
   return granted;
}

/**
 * Ask the user for a permission, shows error dialogs when the user rejects permission, the dialog offers the user
 * to go to permission settings of the app and enable permissions from there.
 * The Promise of this function is resolved when the user enabled the permissions by clicking allow, by
 * going to the permission settings or when the permissions were already granted.
 * Also the promise resolves if the user already granted the permissions in the past.
 * To change dialog texts use the settings parameter.
 * Official info about this flow in the following video: https://youtu.be/iZqDdvhTZj0?list=PLWz5rJ2EKKc-YUddw59dYq61o3ynn3A4X&t=283
 * @param permissionsSource The permission to ask, example: Permissions.LOCATION with this import: import * as Permissions from "expo-permissions"; Also can be an object with a getter and requester: {getter: () => Location.getPermissionsAsync(), requester: () => Location.requestPermissionsAsync()}
 * @param settings Use this parameter to disable dialogs or change dialogs texts.
 */
export async function askForPermission(
   permissionsSource: PermissionSource,
   settings?: AskPermissionSettings
): Promise<void> {
   if (settings == null) {
      settings = {};
   }
   settings.allowContinueWithoutAccepting = settings.allowContinueWithoutAccepting || false;
   settings.rejectedDialogTexts = settings.rejectedDialogTexts || {};

   let result: Permissions.PermissionResponse =
      typeof permissionsSource === "string"
         ? await Permissions.getAsync(permissionsSource)
         : await permissionsSource.getter();

   if (result.status !== "granted") {
      result =
         typeof permissionsSource === "string"
            ? await Permissions.askAsync(permissionsSource)
            : await permissionsSource.requester();
   }

   if (result.status !== "granted") {
      if (settings.allowContinueWithoutAccepting) {
         return Promise.resolve(null);
      }
      await showRejectedPermissionsDialog(settings.rejectedDialogTexts);
      return askForPermission(permissionsSource, settings);
   }

   return Promise.resolve(null);
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
}

export type PermissionSource =
   | Permissions.PermissionType
   | {
        getter: () => Promise<Permissions.PermissionResponse>;
        requester: () => Promise<Permissions.PermissionResponse>;
     };
