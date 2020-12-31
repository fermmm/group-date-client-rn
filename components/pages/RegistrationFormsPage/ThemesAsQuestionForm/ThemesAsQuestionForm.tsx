import React, { FC, useEffect, useState } from "react";
import { ThemeBasicInfo } from "../../../../api/server/shared-tools/endpoints-interfaces/themes";
import { EditableUserProps } from "../../../../api/server/shared-tools/validators/user";
import { usePropsAsQuestions } from "../../../../api/server/user";
import { RegistrationFormName } from "../hooks/useRequiredScreensList";
import Question from "../../../common/Question/Question";
import { ThemesToUpdate } from "../RegistrationFormsPage";
import { useThemeAsQuestionInfo } from "./hooks/useThemeAsQuestionInfo";

export interface PropsThemesAsQuestionForm {
   formName: RegistrationFormName;
   initialData: ThemesInfo;
   questionId: string;
   mandatoryQuestion: boolean;
   onChange: (
      formName: RegistrationFormName,
      newProps: EditableUserProps,
      error: string | null,
      themesToUpdate: ThemesToUpdate
   ) => void;
}

export interface ThemesInfo {
   themesSubscribed?: ThemeBasicInfo[];
   themesBlocked?: ThemeBasicInfo[];
}

const ThemesAsQuestionForm: FC<PropsThemesAsQuestionForm> = props => {
   const { questionId, initialData, onChange, formName, mandatoryQuestion } = props;
   const [selectedAnswer, setSelectedAnswer] = useState<string>(null);
   const [itsImportantChecked, setItsImportantChecked] = useState<boolean>(null);
   const {
      isLoading,
      question,
      initiallySelectedAnswer,
      initiallyItsImportantChecked,
      themesToUpdate
   } = useThemeAsQuestionInfo(questionId, initialData, selectedAnswer, itsImportantChecked);

   useEffect(() => {
      onChange(formName, null, mandatoryQuestion ? getError() : null, themesToUpdate);
   }, [selectedAnswer, itsImportantChecked]);

   const handleQuestionChange = ({ selectedAnswer, itsImportantChecked }) => {
      setSelectedAnswer(selectedAnswer);
      setItsImportantChecked(itsImportantChecked);
   };

   const getError = (): string | null => {
      if (selectedAnswer == null) {
         return "Debes seleccionar una respuesta para continuar";
      }

      return null;
   };

   return (
      <Question
         questionText={question.text}
         answers={question.answers.map(a => ({ text: a.text, id: a.themeId }))}
         incompatibilitiesBetweenAnswers={question.incompatibilitiesBetweenAnswers}
         multipleAnswersAllowed={false}
         initiallySelected={[initiallySelectedAnswer]}
         initiallyItsImportantChecked={initiallyItsImportantChecked}
         onChange={handleQuestionChange}
      />
   );
};

export default ThemesAsQuestionForm;
