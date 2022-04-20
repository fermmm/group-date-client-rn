import React, { FC, useEffect, useRef, useState } from "react";
import { TagBasicInfo } from "../../../../api/server/shared-tools/endpoints-interfaces/tags";
import {
   CIS_GENDERS,
   Gender,
   User
} from "../../../../api/server/shared-tools/endpoints-interfaces/user";
import { includesAnyOf } from "../../../../common-tools/array/arrayTools";
import { useDialogModal } from "../../../common/DialogModal/tools/useDialogModal";
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
   const [gendersSelected, setGendersSelected] = useState<Gender[]>(
      genderTargetMode ? initialData?.likesGenders ?? [] : initialData?.genders ?? []
   );
   const [disabledGenders, setDisabledGenders] = useState<Gender[]>(null);
   const edited = useRef(false);
   const { openDialogModal } = useDialogModal();

   // Send the empty list to the parent so it can also have the error when the user didn't touch the form
   useEffect(() => {
      sendGenderSelection(gendersSelected);
   }, []);

   // initialData may take time to arrive so update the initialGendersSelection when it does.
   useEffect(() => {
      if (edited.current) {
         return;
      }

      if (genderTargetMode) {
         if (initialData.likesGenders) {
            setGendersSelected(initialData.likesGenders);
            sendGenderSelection(initialData.likesGenders);
         }
      } else {
         if (initialData.genders) {
            setGendersSelected(initialData.genders);
            sendGenderSelection(initialData.genders);
         }
      }
   }, [initialData.likesGenders, initialData.genders]);

   const handleGenderChange = (newSelection: Gender[]) => {
      if (newSelection == null) {
         return;
      }

      edited.current = true;

      if (genderTargetMode) {
         setGendersSelected(newSelection);
         sendGenderSelection(newSelection);
         return;
      }

      const isTransMan = newSelection.includes(Gender.TransgenderMan);
      const isTransWoman = newSelection.includes(Gender.TransgenderWoman);
      let finalSelection = [...newSelection];

      // If the user didn't select a biological gender (cis gender) but selected a trans gender we can infer the biological gender and we can set it
      // this is later hidden because it may be miss interpreted by the user.
      if (!includesAnyOf(finalSelection, CIS_GENDERS)) {
         if (isTransMan) {
            finalSelection = [...finalSelection, Gender.Woman];
         }

         if (isTransWoman) {
            finalSelection = [...finalSelection, Gender.Man];
         }
      }

      if (isTransMan || isTransWoman) {
         setDisabledGenders([...CIS_GENDERS]);
      } else {
         setDisabledGenders([]);
      }

      setGendersSelected(finalSelection);
      sendGenderSelection(finalSelection);
   };

   const sendGenderSelection = (selection: Gender[]) => {
      onChange({
         formName,
         newProps: genderTargetMode ? { likesGenders: selection } : { genders: selection },
         error: getError(selection)
      });
   };

   const handleDisabledGenderPress = (genderPressed: Gender) => {
      if (genderTargetMode) {
         return;
      }

      openDialogModal({
         message:
            "Para tildar un género cis debes des-tildar los géneros trans ya que son lo opuesto"
      });
   };

   const getError = (newSelection: Gender[]): string | null => {
      if (newSelection == null || newSelection.length === 0) {
         return "Debes seleccionar al menos un género para continuar";
      }

      if (!includesAnyOf(newSelection, CIS_GENDERS)) {
         return "Es necesario seleccionar al menos un género cis. Puedes seleccionar ambos para dar a entender que lo anulas.";
      }

      return null;
   };

   return (
      <GendersChecklist
         title={genderTargetMode ? "¿Qué géneros te atraen?" : "¿Cuál es tu género?"}
         selection={gendersSelected}
         onChange={handleGenderChange}
         disabledGenders={disabledGenders}
         onDisabledGenderPress={handleDisabledGenderPress}
         initiallyExpanded={true}
      />
   );
};

export default React.memo(GenderForm);
