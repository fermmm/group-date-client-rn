import React, { FC } from "react";
import { Alert, Linking } from "react-native";
import { useAuthentication } from "../../../../api/authentication/useAuthentication";
import { sendUserProps } from "../../../../api/server/user";
import { analyticsLogEvent } from "../../../../common-tools/analytics/tools/analyticsLog";
import { AlertAsync } from "../../../../common-tools/device-native-api/dialogs/AlertAsync";
import PropAsQuestionForm, {
   PropsPropAsQuestionForm
} from "../PropAsQuestionForm/PropAsQuestionForm";
import { OnChangeFormParams } from "../RegistrationFormsPage";

interface PropsIsCoupleQuestion extends PropsPropAsQuestionForm {
   isOnFocus: boolean;
}

export const IsCoupleQuestion: FC<PropsIsCoupleQuestion> = props => {
   const { formName, propNamesToChange, initialData, isOnFocus } = props;
   const { token } = useAuthentication();

   const onChange = (changes: OnChangeFormParams) => {
      if (!isOnFocus) {
         return;
      }

      changes.goToNextStepIsPossible = async () => {
         if (changes?.newProps?.isCoupleProfile === false) {
            return true;
         }

         const isUnicornHunter = await AlertAsync({
            message: "¿Estás buscando a alguien para sumar a tu pareja?",
            buttons: [
               { text: "No", onPressReturns: false },
               { text: "Si, busco trio", onPressReturns: true }
            ],
            options: {
               cancelable: false
            }
         });

         if (isUnicornHunter === false) {
            return true;
         }

         analyticsLogEvent(`is_unicorn_hunter`);

         const isUnicornHunterInsisting = await AlertAsync({
            message:
               "Aquí no hay mucho público para parejas que buscan trio, esta app es de encuentros entre muchxs (más de 3) y sin jerarquías formadas por personas que se conocen de antes, es una propuesta nueva. La app 3Fun tiene el público que buscas.",
            buttons: [
               {
                  text: "Cancelar",
                  onPressReturns: false
               },
               {
                  text: "Continuar buscando trio",
                  onPressReturns: true
               },
               {
                  text: "Descargar 3Fun",
                  onPress: () => {
                     Linking.openURL("market://details?id=com.threesome.swingers.app.threefun");
                     return false;
                  }
               }
            ],
            options: {
               cancelable: false
            }
         });

         sendUserProps(
            {
               token,
               props: { isUnicornHunter, isUnicornHunterInsisting },
               updateProfileCompletedProp: false
            },
            false
         );

         return isUnicornHunterInsisting;
      };

      props.onChange(changes);
   };

   return (
      <PropAsQuestionForm
         formName={formName}
         propNamesToChange={propNamesToChange}
         initialData={initialData}
         onChange={onChange}
      />
   );
};
