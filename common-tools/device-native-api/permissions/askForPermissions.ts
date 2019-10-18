import * as Permissions from "expo-permissions";
import { showRejectedPermissionsDialog, RejectedDialogSettings } from "./dialogRejectedPermissions/dialogRejectedPermissions";

/**
 * Ask the user for a permission, shows error dialogs when the user rejects permission, the dialog offers the user
 * to go to permission settings of the app and enable permissions from there.
 * The Promise of this function is resolved when the user enabled the permissions by clicking allow, by
 * going to the permission settings or when the permissions were already granted.
 * To change dialog texts use the settings parameter.  
 * Official info about this flow in the following video: https://youtu.be/iZqDdvhTZj0?list=PLWz5rJ2EKKc-YUddw59dYq61o3ynn3A4X&t=283
 * @param permissions The permission to ask, example: Permissions.LOCATION with this import: import * as Permissions from "expo-permissions";
 * @param settings Use this parameter to disable dialogs or change dialogs texts.
 */
export async function askForPermissions(permissions: Permissions.PermissionType, settings: AskPermissionSettings = {}): Promise<void> {
   settings.allowContinueWithoutAccepting = settings.allowContinueWithoutAccepting || false;
   settings.rejectedDialogTexts = settings.rejectedDialogTexts || {};

   const { status }: Partial<Permissions.PermissionResponse> = await Permissions.askAsync(permissions);

   if (status !== "granted") {
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