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
            message: "¿Estás buscando a alguien para sumar a tu pareja o para trio?",
            buttons: [
               { text: "No", onPressReturns: false },
               { text: "Si, solo quiero eso", onPressReturns: true }
            ]
         });

         if (isUnicornHunter === false) {
            return true;
         }

         analyticsLogEvent(`is_unicorn_hunter`);

         Alert.alert(
            "",
            "Entonces esta app no te sirve, en un encuentro de esta app no se puede elegir la cantidad de personas, tampoco es una app para trios, solo molestarás a los demás ya que buscan otra cosa. Si continuas serás invisible sin saberlo. Te recomendamos la app 3Fun.",
            [
               {
                  text: "Descargar 3Fun",
                  onPress: () =>
                     Linking.openURL(
                        "https://play.google.com/store/apps/details?id=com.threesome.swingers.app.threefun"
                     )
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
