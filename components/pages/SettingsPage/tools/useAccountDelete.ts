import { useState } from "react";
import { useAuthentication } from "../../../../api/authentication/useAuthentication";
import { deleteAccount, useUser } from "../../../../api/server/user";
import { useDialogModal } from "../../../common/DialogModal/tools/useDialogModal";

export function useAccountDelete() {
   const { openDialogModal } = useDialogModal();
   const { data: localUser } = useUser();
   const { logout } = useAuthentication();
   const [isLoading, setIsLoading] = useState(false);

   const handleAccountDelete = () => {
      const requestAccountDelete = async () => {
         setIsLoading(true);
         const response = await deleteAccount({ token: localUser.token });
         setIsLoading(false);

         if (response.success) {
            openDialogModal({
               message: "Tu cuenta ha sido eliminada con éxito.",
               blockClosing: true,
               buttons: [{ label: "Ok", onPress: logout }]
            });
         } else {
            openDialogModal({
               message: "Error interno al eliminar tu cuenta. Por favor comunicate con nosotros."
            });
         }
      };

      openDialogModal({
         message: "¿VAS A ELIMINAR TU CUENTA?. Esta acción es permanente, no la podemos deshacer.",
         buttons: [
            {
               label: "Eliminar cuenta",
               onPress: () => {
                  openDialogModal({
                     message: "¿ESTAS SEGURX?. Ultima oportunidad de arrepentirte.",
                     buttons: [
                        { label: "ELIMINAR CUENTA", onPress: requestAccountDelete },
                        { label: "Cancelar" }
                     ]
                  });
               }
            },
            { label: "Cancelar" }
         ]
      });
   };

   return { handleAccountDelete, isLoading };
}
