import React, { FC, useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Styles } from "../../../../common-tools/ts-tools/Styles";
import TitleText from "../../../common/TitleText/TitleText";
import TitleMediumText from "../../../common/TitleMediumText/TitleMediumText";
import AgeRangeSelector from "../../../common/AgeSelector/AgeSelector";
import { formValidators } from "../../../../common-tools/formValidators/formValidators";
import { currentTheme, AUTOMATIC_TARGET_AGE, AUTOMATIC_TARGET_DISTANCE } from "../../../../config";
import TextInputExtended from "../../../common/TextInputExtended/TextInputExtended";
import DistanceSelector from "../../../common/DistanceSelector/DistanceSelector";
import { useGeolocation } from "../../../../common-tools/device-native-api/geolocation/getGeolocation";

export interface PropsBasicInfoForm {
   initialFormData: Partial<FormDataBasicInfo>;
   askTargetAge?: boolean;
   askTargetDistance?: boolean;
   onChange(formData: FormDataBasicInfo, error: string | null): void;
}

export interface FormDataBasicInfo {
   name: string;
   age: number;
   height: number;
   targetAgeMin: number;
   targetAgeMax: number;
   targetDistance: number;
   locationLat: number;
   locationLon: number;
   cityName: string;
   country: string;
}

export const BasicInfoForm: FC<PropsBasicInfoForm> = ({
   initialFormData,
   onChange,
   askTargetAge = true,
   askTargetDistance = true
}) => {
   const { geolocation, isLoading } = useGeolocation();
   const [name, setName] = useState(initialFormData?.name);
   const [age, setAge] = useState(initialFormData?.age);
   const [height, setHeight] = useState(initialFormData?.height);
   const [targetDistance, setTargetDistance] = useState(
      initialFormData?.targetDistance ?? AUTOMATIC_TARGET_DISTANCE
   );
   const [targetAgeMin, setTargetAgeMin] = useState(initialFormData?.targetAgeMin);
   const [targetAgeMax, setTargetAgeMax] = useState(initialFormData?.targetAgeMax);
   const [cityName, setCityName] = useState(initialFormData?.cityName);
   const [cityNameModified, setCityNameModified] = useState(false);

   // Calculate a final target age based on the user age and manage cases where the user didn't set the his / her age
   let finalTargetAgeMin = targetAgeMin != null ? targetAgeMin : (age ?? 18) - AUTOMATIC_TARGET_AGE;
   finalTargetAgeMin = finalTargetAgeMin >= 18 ? finalTargetAgeMin : 18;
   const finalTargetAgeMax =
      targetAgeMax != null ? targetAgeMax : (age ?? 18) + AUTOMATIC_TARGET_AGE;

   useEffect(() => {
      onChange(
         {
            name,
            age,
            height,
            targetDistance,
            targetAgeMin: finalTargetAgeMin,
            targetAgeMax: finalTargetAgeMax,
            locationLat: geolocation?.coords?.latitude,
            locationLon: geolocation?.coords?.longitude,
            country: geolocation?.info?.isoCountryCode,
            cityName
         },
         getError()
      );
   }, [name, age, height, targetDistance, targetAgeMin, targetAgeMax, cityName, geolocation]);

   useEffect(() => {
      if (!cityName && !cityNameModified) {
         setCityName(geolocation?.info?.district ?? geolocation?.info?.region ?? "");
      }
   }, [geolocation]);

   const getError = () => {
      return getNameError() || getAgeError() || getCityNameError();
   };

   const getNameError = () => {
      const maxCharactersAllowed = 32;

      if (!name) {
         return "No has completado tu nombre o apodo";
      }

      if (name.length < 2) {
         return "El nombre o apodo es demasiado corto";
      }

      if (name.length > maxCharactersAllowed) {
         return (
            "Te has pasado del máximo de caracteres permitidos por " +
            (name.length - maxCharactersAllowed) +
            " caracteres"
         );
      }

      return null;
   };

   const getAgeError = () => {
      if (!age) {
         return "No has completado el campo de tu edad";
      }

      if (age < 12) {
         return "Tu edad demasiado baja para lo que se permite en este tipo de apps, lo sentimos.";
      }

      if (age >= 179) {
         return "Tu edad es demasiado alta para ser la de un ser humano.";
      }

      return null;
   };

   const getCityNameError = () => {
      const maxCharactersAllowed = 32;

      if (!cityName || cityName.length < 2) {
         return "No has completado el nombre de tu ciudad o región";
      }

      if (cityName.length > maxCharactersAllowed) {
         return (
            "Te has pasado del máximo de caracteres permitidos por " +
            (cityName.length - maxCharactersAllowed) +
            " caracteres"
         );
      }

      return null;
   };

   return (
      <View style={styles.mainContainer}>
         <TitleText style={styles.title}>Datos básicos</TitleText>
         <TextInputExtended
            title="Tu nombre o apodo"
            errorText={getNameError()}
            mode="outlined"
            value={name}
            onChangeText={t => setName(formValidators.name(t).result.text)}
         />
         <TextInputExtended
            title="Tu edad"
            errorText={getAgeError()}
            mode="outlined"
            keyboardType="number-pad"
            value={age ? age.toString() : ""}
            onChangeText={t => setAge(Number(formValidators.age(t).result.text))}
         />
         <TextInputExtended
            title="¿Con qué nombre se conoce mejor tu ciudad o región?"
            titleLine2="Este dato les servirá a lxs demás para saber más o menos de donde eres"
            errorText={getCityNameError()}
            mode="outlined"
            value={cityName}
            onChangeText={t => {
               setCityNameModified(true);
               setCityName(t);
            }}
         />
         <TextInputExtended
            title="Tu altura en centímetros (opcional) ej: 160"
            titleLine2="Este dato para algunxs es muy importante y a otrxs no les importa"
            mode="outlined"
            keyboardType="number-pad"
            value={height ? height.toString() : ""}
            onChangeText={t => setHeight(Number(formValidators.bodyHeight(t).result.text) || 0)}
         />
         {askTargetAge && (
            <>
               <TitleMediumText style={styles.label}>
                  ¿Qué rango de edad te interesa más?
               </TitleMediumText>
               <TitleMediumText style={styles.labelLine2}>
                  Esta funcionalidad no actúa de forma totalmente estricta
               </TitleMediumText>
               <AgeRangeSelector
                  min={finalTargetAgeMin}
                  max={finalTargetAgeMax}
                  style={styles.ageSelector}
                  onChange={({ min, max }) => {
                     setTargetAgeMin(min);
                     setTargetAgeMax(max);
                  }}
               />
            </>
         )}
         {askTargetDistance && (
            <>
               <TitleMediumText style={styles.label}>
                  ¿Qué tan lejos pueden estar lxs demás usuarixs?
               </TitleMediumText>
               <TitleMediumText style={styles.labelLine2}>
                  Esta funcionalidad no actúa de forma totalmente estricta
               </TitleMediumText>
               <DistanceSelector
                  value={targetDistance}
                  onChange={newDistance => {
                     setTargetDistance(newDistance);
                  }}
               />
            </>
         )}
      </View>
   );
};

const styles: Styles = StyleSheet.create({
   mainContainer: {
      padding: 20,
      paddingTop: 10
   },
   title: {
      fontSize: 19,
      marginBottom: 20
   },
   label: {
      marginTop: 30,
      marginBottom: 0
   },
   labelLine2: {
      marginBottom: 0,
      fontFamily: currentTheme.font.extraLight
   },
   ageSelector: {
      marginLeft: 5
   }
});

export default BasicInfoForm;
