import React, { FC } from "react";
import { Alert, Linking } from "react-native";
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

   const onChange = (changes: OnChangeFormParams) => {
      if (!isOnFocus) {
         return;
      }

      changes.goToNextStepIsPossible = async () => {
         if (changes?.newProps?.isCoupleProfile === false) {
            return true;
         }

         const isUnicornHunter = await AlertAsync({
            message: "¿Estás buscando a alguien para sumar a tu pareja, un trio o swinger?",
            buttons: [
               { text: "No", onPressReturns: false },
               { text: "Si, solo quiero a alguien, trio o swinger", onPressReturns: true }
            ]
         });

         if (isUnicornHunter === false) {
            return true;
         }

         analyticsLogEvent(`is_unicorn_hunter`);

         Alert.alert(
            "",
            "Entonces esta app no te sirve, aquí los encuentros son entre muchas personas, no es una app para trios, es una propuesta nueva. Cada app tiene su público. La app 3Fun tiene lo que buscas.",
            [
               {
                  text: "Descargar 3Fun",
                  onPress: () =>
                     Linking.openURL(
                        "https://play.google.com/store/apps/details?id=com.threesome.swingers.app.threefun"
                     )
               },
               {
                  text: "Me importa una mierda" // Implement shadow ban
               }
            ]
         );

         return false;
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
