import React, { FC, useEffect, useMemo, useState } from "react";
import { TagBasicInfo } from "../../../../api/server/shared-tools/endpoints-interfaces/tags";
import { Gender, User } from "../../../../api/server/shared-tools/endpoints-interfaces/user";
import { getUserGenderSelection } from "../../../../api/server/shared-tools/user-tools/getUserGenderSelection";
import { EditableUserProps } from "../../../../api/server/shared-tools/validators/user";
import { TagsToUpdate } from "../RegistrationFormsPage";
import GendersChecklist from "./GendersChecklist/GendersChecklist";
import { getGenderTagsToUpdate } from "./tools/getGenderTagsToUpdate";

export interface PropsGenderForm {
   formName: string;
   initialData: Partial<User>;
   genderTargetMode?: boolean;
   onChange: (
      formName: string,
      newProps: EditableUserProps,
      error: string | null,
      tagsToUpdate: TagsToUpdate
   ) => void;
}

export interface GenderForm {
   tagsSubscribed?: TagBasicInfo[];
   tagsBlocked?: TagBasicInfo[];
}

const GenderForm: FC<PropsGenderForm> = props => {
   const { initialData, onChange, formName, genderTargetMode = false } = props;
   const [gendersSelected, setGendersSelected] = useState<Gender[]>(null);
   const initialGenderSelection = useMemo(() => getUserGenderSelection(initialData), [initialData]);

   useEffect(() => {
      onChange(
         formName,
         genderTargetMode ? { targetGenderIsSelected: true } : null,
         getError(),
         getGenderTagsToUpdate({
            gendersSelected,
            initialGenderSelection,
            genderTargetMode
         })
      );
   }, [gendersSelected]);

   const handleSelectionChange = (selection: Gender[]) => {
      setGendersSelected(selection);
   };

   const getError = (): string | null => {
      if (gendersSelected == null) {
         return "Debes seleccionar al menos un genero para continuar";
      }

      return null;
   };

   const getInitialGenderSelection = () => {
      if (!genderTargetMode) {
         return initialGenderSelection.subscribed;
      }

      if (initialData.targetGenderIsSelected) {
         return initialGenderSelection.nonBlocked;
      } else {
         return [];
      }
   };

   return (
      <GendersChecklist
         title={genderTargetMode ? "¿Qué géneros te atraen?" : "¿Cuál es tu género?"}
         initiallySelected={getInitialGenderSelection()}
         onChange={handleSelectionChange}
      />
   );
};

export default React.memo(GenderForm);
