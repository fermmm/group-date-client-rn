import React, { FC, useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Styles } from "../../../../common-tools/ts-tools/Styles";
import TitleText from "../../../common/TitleText/TitleText";
import AgeRangeSelector from "../../../common/AgeSelector/AgeSelector";
import {
   AUTOMATIC_TARGET_AGE,
   AUTOMATIC_TARGET_DISTANCE,
   MAX_AGE_ALLOWED,
   MIN_AGE_ALLOWED
} from "../../../../config";
import DistanceSelector from "../../../common/DistanceSelector/DistanceSelector";
import { RegistrationFormName } from "../hooks/useRequiredFormList";
import TitleSmallText from "../../../common/TitleSmallText/TitleSmallText";
import EmptySpace from "../../../common/EmptySpace/EmptySpace";
import { fromAgeToBirthDate, fromBirthDateToAge } from "../../../../api/tools/date-tools";

export interface PropsFiltersForm {
   formName: RegistrationFormName;
   initialData: Partial<FormDataFilters>;
   birthDateSelected?: number;
   onChange(formName: RegistrationFormName, formData: FormDataFilters, error: string | null): void;
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
   birthDateSelected = fromAgeToBirthDate(MIN_AGE_ALLOWED)
}) => {
   const [targetDistance, setTargetDistance] = useState(
      initialData?.targetDistance ?? AUTOMATIC_TARGET_DISTANCE
   );
   const [targetAgeMin, setTargetAgeMin] = useState(initialData?.targetAgeMin);
   const [targetAgeMax, setTargetAgeMax] = useState(initialData?.targetAgeMax);

   useEffect(() => {
      onChange(
         formName,
         {
            targetDistance,
            targetAgeMin:
               targetAgeMin ??
               normalizeAge(fromBirthDateToAge(birthDateSelected) - AUTOMATIC_TARGET_AGE),
            targetAgeMax:
               targetAgeMax ??
               normalizeAge(fromBirthDateToAge(birthDateSelected) + AUTOMATIC_TARGET_AGE)
         },
         null
      );
   }, [targetDistance, targetAgeMin, targetAgeMax, formName, birthDateSelected]);

   const normalizeAge = (num: number): number => {
      if (num < MIN_AGE_ALLOWED) {
         return MIN_AGE_ALLOWED;
      }

      if (num > MAX_AGE_ALLOWED) {
         return MAX_AGE_ALLOWED;
      }

      return num;
   };

   return (
      <View style={styles.mainContainer}>
         <TitleText style={styles.title}>¿Qué rango de edad te interesa más?</TitleText>
         <TitleSmallText style={styles.titleSmall}>
            Esta funcionalidad no actúa de forma totalmente estricta.
         </TitleSmallText>
         <AgeRangeSelector
            min={
               targetAgeMin ??
               normalizeAge(fromBirthDateToAge(birthDateSelected) - AUTOMATIC_TARGET_AGE)
            }
            max={
               targetAgeMax ??
               normalizeAge(fromBirthDateToAge(birthDateSelected) + AUTOMATIC_TARGET_AGE)
            }
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
