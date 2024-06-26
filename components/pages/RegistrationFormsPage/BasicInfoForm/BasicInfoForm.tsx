import React, { FC, useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import * as Location from "expo-location";
import moment from "moment";
import { Styles } from "../../../../common-tools/ts-tools/Styles";
import TitleText from "../../../common/TitleText/TitleText";
import { formValidators } from "../../../../common-tools/forms/formValidators";
import { currentTheme } from "../../../../config";
import TextInputExtended from "../../../common/TextInputExtended/TextInputExtended";
import { getGeolocationPosition } from "../../../../common-tools/device-native-api/geolocation/getGeolocationPosition";
import { RegistrationFormName } from "../tools/useRequiredFormList";
import { fromAgeToBirthDate } from "../../../../api/tools/date-tools";
import MonthSelector from "../../../common/MonthSelector/MonthSelector";
import TitleMediumText from "../../../common/TitleMediumText/TitleMediumText";
import EmptySpace from "../../../common/EmptySpace/EmptySpace";
import {
   CenteredMethod,
   LoadingAnimation
} from "../../../common/LoadingAnimation/LoadingAnimation";
import { OnChangeFormParams } from "../RegistrationFormsPage";
import ButtonStyled from "../../../common/ButtonStyled/ButtonStyled";
import { useTheme } from "../../../../common-tools/themes/useTheme/useTheme";
import { askForPermission } from "../../../../common-tools/device-native-api/permissions/askForPermissions";
import { getGeolocationAddress } from "../../../../common-tools/device-native-api/geolocation/getGeolocationAddress";

export interface PropsBasicInfoForm {
   formName: RegistrationFormName;
   initialData: Partial<FormDataBasicInfo>;
   onChange: (props: OnChangeFormParams) => void;
}

export interface FormDataBasicInfo {
   name: string;
   birthDate: number;
   height: number;
   locationLat: number;
   locationLon: number;
   cityName: string;
   country: string;
}

export const BasicInfoForm: FC<PropsBasicInfoForm> = ({ initialData, onChange, formName }) => {
   const isLoading = false;
   const [locationLat, setLocationLat] = useState<number>(initialData?.locationLat);
   const [locationLon, setLocationLon] = useState<number>(initialData?.locationLon);
   const [loadingCityName, setLoadingCityName] = useState<boolean>(false);
   const { colors } = useTheme();
   const [name, setName] = useState(initialData?.name);
   const [birthMonth, setBirthMonth] = useState<number>(
      initialData?.birthDate ? moment(initialData.birthDate, "X").month() : 0
   );
   const [birthYear, setBirthYear] = useState(
      initialData?.birthDate ? moment(initialData.birthDate, "X").year() : null
   );
   const [height, setHeight] = useState(initialData?.height);
   const [cityName, setCityName] = useState(initialData?.cityName);

   useEffect(() => {
      const newProps: Partial<FormDataBasicInfo> = {
         name,
         birthDate: birthYear
            ? moment()
                 .month(birthMonth)
                 .year(birthYear)
                 .day(0)
                 .hour(0)
                 .minute(0)
                 .second(0)
                 .millisecond(0)
                 .unix()
            : null,
         height: height ?? 0,
         cityName
      };

      if (locationLat != initialData?.locationLat && locationLon != initialData?.locationLon) {
         newProps.locationLat = locationLat;
         newProps.locationLon = locationLon;
      }

      onChange({ formName, newProps, error: getError() });
   }, [name, birthMonth, birthYear, height, cityName, locationLat, locationLon, formName]);

   const handleCityAutocompletePress = async () => {
      setLoadingCityName(true);
      try {
         const permissionGranted = await askForPermission(
            {
               getter: () => Location.getForegroundPermissionsAsync(),
               requester: () => Location.requestForegroundPermissionsAsync()
            },
            { allowContinueWithoutAccepting: true }
         );

         if (!permissionGranted) {
            setLoadingCityName(false);
            return;
         }

         const coords = await getGeolocationPosition({
            errorMessageCancellable: true,
            enableBackupCoords: false
         });

         if (coords?.latitude == null || coords?.longitude == null) {
            setLoadingCityName(false);
            return;
         }

         setLocationLat(coords.latitude);
         setLocationLon(coords.longitude);

         const address = await getGeolocationAddress(coords);

         setCityName(address.city);
      } catch (e) {
         setLoadingCityName(false);
      }

      setLoadingCityName(false);
   };

   const getError = () => {
      return getNameError() || getBirthYearError() || getCityNameError() || getHeightError();
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

   const getBirthYearError = () => {
      if (!birthYear) {
         return "No has completado el campo de tu año de nacimiento";
      }

      if (String(birthYear).split(" ").join("").length < 4) {
         return "El formato del año debe ser AAAA. Ej: 1987";
      }

      if (birthYear > moment(fromAgeToBirthDate(18), "X").year()) {
         return "Tu edad demasiado baja para lo que se permite en este tipo de apps, lo sentimos";
      }

      if (birthYear < moment(fromAgeToBirthDate(100), "X").year()) {
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

   if (isLoading) {
      return <LoadingAnimation centeredMethod={CenteredMethod.Relative} />;
   }

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
            title="Tu año de nacimiento"
            errorText={getBirthYearError()}
            mode="outlined"
            keyboardType="number-pad"
            value={String(birthYear || "")}
            onChangeText={t => setBirthYear(Number(formValidators.birthYear(t).result.text))}
         />
         <TitleMediumText style={styles.title}>Tu mes de nacimiento</TitleMediumText>
         <MonthSelector value={birthMonth} onChange={newMonth => setBirthMonth(newMonth)} />
         <EmptySpace />
         <TextInputExtended
            title="Tu altura en centímetros (opcional) ej: 160"
            titleLine2="Este dato para algunxs es muy importante y a otrxs no les importa"
            mode="outlined"
            keyboardType="number-pad"
            value={height ? height.toString() : ""}
            onChangeText={t => setHeight(Number(formValidators.bodyHeight(t).result.text) || 0)}
         />
         <TextInputExtended
            title="¿Con qué nombre se conoce mejor tu ciudad o región?"
            titleLine2="Este dato les servirá a lxs demás para saber más o menos de donde eres"
            errorText={getCityNameError()}
            mode="outlined"
            value={cityName}
            onChangeText={t => setCityName(t)}
            renderBottomElement={() =>
               !loadingCityName ? (
                  <ButtonStyled
                     mode="text"
                     onPress={handleCityAutocompletePress}
                     color={colors.accent2}
                  >
                     Auto-completar
                  </ButtonStyled>
               ) : (
                  <LoadingAnimation
                     centeredMethod={CenteredMethod.Relative}
                     style={{ height: 60, marginTop: 10 }}
                  />
               )
            }
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
