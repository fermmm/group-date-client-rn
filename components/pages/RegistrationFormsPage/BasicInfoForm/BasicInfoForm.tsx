import React, { FC, useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Styles } from "../../../../common-tools/ts-tools/Styles";
import TitleText from "../../../common/TitleText/TitleText";
import { formValidators } from "../../../../common-tools/formValidators/formValidators";
import { currentTheme } from "../../../../config";
import TextInputExtended from "../../../common/TextInputExtended/TextInputExtended";
import { useGeolocation } from "../../../../common-tools/device-native-api/geolocation/getGeolocation";
import { RegistrationFormName } from "../hooks/useRequiredFormList";

export interface PropsBasicInfoForm {
   formName: RegistrationFormName;
   initialData: Partial<FormDataBasicInfo>;
   onChange(
      formName: RegistrationFormName,
      formData: FormDataBasicInfo,
      error: string | null
   ): void;
}

export interface FormDataBasicInfo {
   name: string;
   age: number;
   height: number;
   locationLat: number;
   locationLon: number;
   cityName: string;
   country: string;
}

export const BasicInfoForm: FC<PropsBasicInfoForm> = ({ initialData, onChange, formName }) => {
   const { geolocation, isLoading } = useGeolocation();
   const [name, setName] = useState(initialData?.name);
   const [age, setAge] = useState(initialData?.age);
   const [height, setHeight] = useState(initialData?.height);
   const [cityName, setCityName] = useState(initialData?.cityName);
   const [cityNameModified, setCityNameModified] = useState(false);

   useEffect(() => {
      onChange(
         formName,
         {
            name,
            age,
            height: height ?? 0,
            locationLat: geolocation?.coords?.latitude,
            locationLon: geolocation?.coords?.longitude,
            country: geolocation?.info?.isoCountryCode,
            cityName
         },
         getError()
      );
   }, [name, age, height, cityName, geolocation, formName]);

   useEffect(() => {
      if (!cityName && !cityNameModified) {
         setCityName(geolocation?.info?.district ?? geolocation?.info?.region ?? "");
      }
   }, [geolocation]);

   const getError = () => {
      return (
         getNameError() ||
         getAgeError() ||
         getCityNameError() ||
         getHeightError() ||
         getGeolocationError()
      );
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
         return "Tu edad demasiado baja para lo que se permite en este tipo de apps, lo sentimos";
      }

      if (age >= 179) {
         return "Tu edad es demasiado alta para ser la de un ser humano";
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

   const getHeightError = () => {
      if (height != null && height >= 300) {
         return "Tu altura es demasiado alta para ser la de un ser humano";
      }

      return null;
   };

   const getGeolocationError = () => {
      if (
         !geolocation?.coords?.latitude ||
         !geolocation?.coords?.longitude ||
         !geolocation?.info?.isoCountryCode
      ) {
         return "No se puede obtener tu localización, revisa los permisos de la app";
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
   label: {
      marginTop: 30,
      marginBottom: 0
   },
   labelLine2: {
      marginBottom: 0,
      fontFamily: currentTheme.font.extraLight
   }
});

export default React.memo(BasicInfoForm);
