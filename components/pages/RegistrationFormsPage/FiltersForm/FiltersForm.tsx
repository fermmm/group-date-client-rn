import React, { FC, useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Styles } from "../../../../common-tools/ts-tools/Styles";
import TitleText from "../../../common/TitleText/TitleText";
import AgeRangeSelector from "../../../common/AgeSelector/AgeSelector";
import {
   AUTOMATIC_TARGET_AGE,
   DEFAULT_TARGET_DISTANCE,
   MAX_AGE_ALLOWED,
   MIN_AGE_ALLOWED
} from "../../../../config";
import DistanceSelector from "../../../common/DistanceSelector/DistanceSelector";
import { RegistrationFormName } from "../tools/useRequiredFormList";
import TitleSmallText from "../../../common/TitleSmallText/TitleSmallText";
import EmptySpace from "../../../common/EmptySpace/EmptySpace";
import { fromBirthDateToAge } from "../../../../api/tools/date-tools";
import { OnChangeFormParams } from "../RegistrationFormsPage";

export interface PropsFiltersForm {
   formName: RegistrationFormName;
   initialData: Partial<FormDataFilters>;
   birthDateSelected?: number;
   onChange: (props: OnChangeFormParams) => void;
}

export interface FormDataFilters {
   targetAgeMin: number;
   targetAgeMax: number;
   targetDistance: number;
}

export const FiltersForm: FC<PropsFiltersForm> = ({
   initialData,
   onChange,
   formName,
   birthDateSelected
}) => {
   const [targetDistance, setTargetDistance] = useState(
      initialData?.targetDistance ?? DEFAULT_TARGET_DISTANCE
   );
   const [targetAgeMin, setTargetAgeMin] = useState(initialData?.targetAgeMin);
   const [targetAgeMax, setTargetAgeMax] = useState(initialData?.targetAgeMax);

   // Effect to update the values here when the user changes his/her age in the age selection form
   useEffect(() => {
      if (birthDateSelected != null) {
         setTargetAgeMin(
            normalizeAge(fromBirthDateToAge(birthDateSelected) - AUTOMATIC_TARGET_AGE)
         );
         setTargetAgeMax(
            normalizeAge(fromBirthDateToAge(birthDateSelected) + AUTOMATIC_TARGET_AGE)
         );
      }
   }, [birthDateSelected]);

   // Effect to send the changes
   useEffect(() => {
      onChange({
         formName,
         newProps: {
            targetDistance,
            targetAgeMin: targetAgeMin ?? defaultTargetAgeMin,
            targetAgeMax: targetAgeMax ?? defaultTargetAgeMax
         }
      });
   }, [targetDistance, targetAgeMin, targetAgeMax, formName]);

   const normalizeAge = (num: number): number => {
      if (num < MIN_AGE_ALLOWED) {
         return MIN_AGE_ALLOWED;
      }

      if (num > MAX_AGE_ALLOWED) {
         return MAX_AGE_ALLOWED;
      }

      return num;
   };

   const defaultTargetAgeMin = normalizeAge(MIN_AGE_ALLOWED - AUTOMATIC_TARGET_AGE);
   const defaultTargetAgeMax = normalizeAge(MIN_AGE_ALLOWED + AUTOMATIC_TARGET_AGE);

   return (
      <View style={styles.mainContainer}>
         <TitleText style={styles.title}>¿Qué rango de edad te interesa más?</TitleText>
         <TitleSmallText style={styles.titleSmall}>
            Esta funcionalidad no actúa de forma totalmente estricta.
         </TitleSmallText>
         <AgeRangeSelector
            min={targetAgeMin ?? defaultTargetAgeMin}
            max={targetAgeMax ?? defaultTargetAgeMax}
            style={styles.ageSelector}
            onChange={({ min, max }) => {
               setTargetAgeMin(min);
               setTargetAgeMax(max);
            }}
         />
         <EmptySpace />
         <TitleText style={styles.title}>¿Qué tan lejos pueden estar lxs demás usuarixs?</TitleText>
         <TitleSmallText style={styles.titleSmall}>
            Esta funcionalidad no actúa de forma totalmente estricta.
         </TitleSmallText>
         <DistanceSelector
            value={targetDistance}
            onChange={newDistance => {
               setTargetDistance(newDistance);
            }}
         />
      </View>
   );
};

const styles: Styles = StyleSheet.create({
   mainContainer: {
      padding: 20,
      paddingTop: 10
   },
   title: {
      marginBottom: 20
   },
   titleSmall: {
      paddingLeft: 0
   },
   ageSelector: {
      marginLeft: 5
   }
});

export default React.memo(FiltersForm);
