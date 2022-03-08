import React, { FC, useEffect, useState } from "react";
import { TagBasicInfo } from "../../../../api/server/shared-tools/endpoints-interfaces/tags";
import {
   CIS_GENDERS,
   Gender,
   NON_CIS_GENDERS,
   User
} from "../../../../api/server/shared-tools/endpoints-interfaces/user";
import { includesAnyOf } from "../../../../common-tools/array/arrayTools";
import { OnChangeFormParams } from "../RegistrationFormsPage";
import GendersChecklist from "./GendersChecklist/GendersChecklist";

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
   const initialGenderSelection = genderTargetMode
      ? initialData.likesGenders ?? [...NON_CIS_GENDERS]
      : initialData.genders;

   useEffect(() => {
      if (!isOnFocus) {
         return;
      }

      onChange({
         formName,
         newProps: genderTargetMode
            ? { likesGenders: gendersSelected }
            : { genders: gendersSelected },
         error: getError()
      });
   }, [gendersSelected, isOnFocus]);

   const getError = (): string | null => {
      if (gendersSelected == null || gendersSelected.length === 0) {
         return "Debes seleccionar al menos un género para continuar";
      }

      if (!includesAnyOf(gendersSelected, CIS_GENDERS)) {
         return "Es necesario seleccionar al menos un género cis, es por una razón técnica. Puedes seleccionar ambos géneros cis como una forma de dar a entender que lo anulas. En el futuro mejoraremos esto.";
      }

      return null;
   };

   return (
      <GendersChecklist
         title={genderTargetMode ? "¿Qué géneros te atraen?" : "¿Cuál es tu género?"}
         initiallySelected={initialGenderSelection}
         onChange={setGendersSelected}
         initiallyExpanded={true}
      />
   );
};

export default React.memo(GenderForm);
