import React, { FC, useEffect, useMemo, useState } from "react";
import { Alert } from "react-native";
import { TagBasicInfo } from "../../../../api/server/shared-tools/endpoints-interfaces/tags";
import {
   CIS_GENDERS,
   Gender,
   NON_CIS_GENDERS,
   User
} from "../../../../api/server/shared-tools/endpoints-interfaces/user";
import { getUserGenderSelection } from "../../../../api/server/shared-tools/user-tools/getUserGenderSelection";
import { OnChangeFormParams } from "../RegistrationFormsPage";
import GendersChecklist from "./GendersChecklist/GendersChecklist";
import { getGenderTagsToUpdate } from "./tools/getGenderTagsToUpdate";

export interface PropsGenderForm {
   formName: string;
   initialData: Partial<User>;
   genderTargetMode?: boolean;
   isOnFocus: boolean;
   onChange: (props: OnChangeFormParams) => void;
}

export interface GenderForm {
   tagsSubscribed?: TagBasicInfo[];
   tagsBlocked?: TagBasicInfo[];
}

// TODO: El boton de guardar cambios no esta funcionando con este formulario
const GenderForm: FC<PropsGenderForm> = props => {
   const { initialData, onChange, formName, genderTargetMode = false, isOnFocus } = props;
   const [gendersSelected, setGendersSelected] = useState<Gender[]>(null);
   const initialGenderSelection = useMemo(() => getUserGenderSelection(initialData), [initialData]);

   const getInitialGenderSelection = () => {
      if (!genderTargetMode) {
         return initialGenderSelection.subscribed;
      }

      if (initialData?.targetGenderIsSelected) {
         return initialGenderSelection.nonBlocked;
      } else {
         return [...NON_CIS_GENDERS];
      }
   };

   const goToNextStepIsPossible = async () => {
      if (!genderTargetMode) {
         return true;
      }

      if (gendersSelected.find(g => CIS_GENDERS.includes(g)) != null) {
         return true;
      }

      let resolvePromise: (bool: boolean) => void;
      const promise = new Promise<boolean>(resolve => (resolvePromise = resolve));

      Alert.alert("", "No verás ni mujeres ni hombres, ¿estas segurx?", [
         { text: "Cancelar", onPress: () => resolvePromise(false) },
         { text: "Continuar", onPress: () => resolvePromise(true) }
      ]);

      return promise;
   };

   useEffect(() => {
      if (!isOnFocus) {
         return;
      }

      onChange({
         formName,
         newProps: genderTargetMode ? { targetGenderIsSelected: true } : null,
         error: getError(),
         tagsToUpdate: getGenderTagsToUpdate({
            gendersSelected,
            initialGenderSelection,
            genderTargetMode
         }),
         goToNextStepIsPossible
      });
   }, [gendersSelected, isOnFocus]);

   const handleSelectionChange = (selection: Gender[]) => {
      setGendersSelected(selection);
   };

   const getError = (): string | null => {
      if (gendersSelected == null || gendersSelected.length === 0) {
         return "Debes seleccionar al menos un género para continuar";
      }

      return null;
   };

   return (
      <GendersChecklist
         title={genderTargetMode ? "¿Qué géneros te atraen?" : "¿Cuál es tu género?"}
         initiallySelected={getInitialGenderSelection()}
         onChange={handleSelectionChange}
         initiallyExpanded={true}
      />
   );
};

export default React.memo(GenderForm);
