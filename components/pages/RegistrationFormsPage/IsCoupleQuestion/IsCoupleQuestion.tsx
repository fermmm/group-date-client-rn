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
            message: "¿Estás buscando una mujer para sumar a tu pareja o para trio?",
            buttons: [
               { text: "No", onPressReturns: false },
               { text: "Si", onPressReturns: true }
            ]
         });

         if (isUnicornHunter === false) {
            return true;
         }

         analyticsLogEvent(`is_unicorn_hunter`);

         Alert.alert(
            "",
            "Entonces esta app no te sirve, aquí los encuentros son de a muchxs y no hay una función para limitar a 3, tampoco es la temática de la app. Si continuas tu búsqueda de 3 lo consideramos spam y seras invisible. Te recomendamos la app 3Fun.",
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
