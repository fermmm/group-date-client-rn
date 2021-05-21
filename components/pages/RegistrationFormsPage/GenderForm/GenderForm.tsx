import React, { FC, useEffect, useMemo, useState } from "react";
import { TagBasicInfo } from "../../../../api/server/shared-tools/endpoints-interfaces/tags";
import { Gender, User } from "../../../../api/server/shared-tools/endpoints-interfaces/user";
import { getUserGenderSelection } from "../../../../api/server/shared-tools/user-tools/getUserGenderSelection";
import { EditableUserProps } from "../../../../api/server/shared-tools/validators/user";
import Question, { QuestionOnChange } from "../../../common/Question/Question";
import { TagsToUpdate } from "../RegistrationFormsPage";
import { getGenderTagsToUpdate } from "./tools/getGenderTagsToUpdate";

// TODO: Aca habria que reimplementar <Question> para que tenga una parte de las respuestas colapsadas o divididas por simplicidad
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
   const genderList = useMemo(() => Object.values(Gender), []);
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

   const handleQuestionChange = ({ selectedAnswerMultiple }: QuestionOnChange) => {
      setGendersSelected(selectedAnswerMultiple as Gender[]);
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
      <Question
         questionText={genderTargetMode ? "¿Qué géneros te atraen?" : "¿Cuál es tu género?"}
         answers={genderList.map(gender => ({
            text: gender,
            id: gender
         }))}
         multipleAnswersAllowed
         initiallySelected={getInitialGenderSelection()}
         onChange={handleQuestionChange}
      />
   );
};

export default React.memo(GenderForm);
