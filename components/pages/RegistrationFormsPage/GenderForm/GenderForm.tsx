import React, { FC, useEffect, useMemo, useState } from "react";
import { TagBasicInfo } from "../../../../api/server/shared-tools/endpoints-interfaces/tags";
import {
   CIS_GENDERS,
   Gender,
   NON_CIS_GENDERS,
   User
} from "../../../../api/server/shared-tools/endpoints-interfaces/user";
import { getUserGenderSelection } from "../../../../api/server/shared-tools/user-tools/getUserGenderSelection";
import { includesAnyOf } from "../../../../common-tools/array/arrayTools";
import { AlertAsync } from "../../../../common-tools/device-native-api/dialogs/AlertAsync";
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

      if (includesAnyOf(gendersSelected, CIS_GENDERS)) {
         return true;
      }

      const canContinue = await AlertAsync({
         message: "No verás ni mujeres ni hombres, ¿estas segurx?",
         buttons: [
            { text: "Cancelar", onPressReturns: false },
            { text: "Continuar", onPressReturns: true }
         ]
      });

      return canContinue;
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
         onChange={setGendersSelected}
         initiallyExpanded={true}
      />
   );
};

export default React.memo(GenderForm);
