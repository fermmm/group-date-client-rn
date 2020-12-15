import { useState } from "react";
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
 * @param permissions The permission to ask, example: Permissions.LOCATION with this import: import * as Permissions from "expo-permissions";
 * @param settings Use this parameter to disable dialogs or change dialogs texts.
 */
export function usePermission(
   permissions: Permissions.PermissionType,
   settings?: AskPermissionSettings
) {
   const [granted, setGranted] = useState(false);
   if (!granted) {
      askForPermissions(permissions, settings).then(() => setGranted(true));
   }
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
 * @param permissions The permission to ask, example: Permissions.LOCATION with this import: import * as Permissions from "expo-permissions";
 * @param settings Use this parameter to disable dialogs or change dialogs texts.
 */
async function askForPermissions(
   permissions: Permissions.PermissionType,
   settings?: AskPermissionSettings
): Promise<void> {
   if (settings == null) {
      settings = {};
   }
   settings.allowContinueWithoutAccepting = settings.allowContinueWithoutAccepting || false;
   settings.rejectedDialogTexts = settings.rejectedDialogTexts || {};

   let result: Permissions.PermissionResponse = await Permissions.getAsync(permissions);

   if (result.status !== "granted") {
      result = await Permissions.askAsync(permissions);
   }

   if (result.status !== "granted") {
      if (settings.allowContinueWithoutAccepting) {
         return Promise.resolve(null);
      }
      await showRejectedPermissionsDialog(settings.rejectedDialogTexts);
      return askForPermissions(permissions, settings);
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
