import React, { FC, useEffect, useState } from "react";
import {
   ThemeBasicInfo,
   ThemesAsQuestion
} from "../../../../api/server/shared-tools/endpoints-interfaces/themes";
import { EditableUserProps } from "../../../../api/server/shared-tools/validators/user";
import {
   CenteredMethod,
   LoadingAnimation
} from "../../../common/LoadingAnimation/LoadingAnimation";
import Question from "../../../common/Question/Question";
import { ThemesToUpdate } from "../RegistrationFormsPage";
import { useThemeAsQuestionInfo } from "./hooks/useThemeAsQuestionInfo";

export interface PropsThemesAsQuestionForm {
   formName: string;
   initialData: ThemesInfo;
   questionId: string;
   mandatoryQuestion: boolean;
   themesAsQuestions: ThemesAsQuestion[];
   onChange: (
      formName: string,
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
   const {
      questionId,
      initialData,
      onChange,
      formName,
      mandatoryQuestion,
      themesAsQuestions
   } = props;
   const [selectedAnswer, setSelectedAnswer] = useState<string>(null);
   const [itsImportantChecked, setItsImportantChecked] = useState<boolean>(null);
   const {
      isLoading,
      question,
      initiallySelectedAnswer,
      initiallyItsImportantChecked,
      themesToUpdate
   } = useThemeAsQuestionInfo(
      themesAsQuestions,
      questionId,
      initialData,
      selectedAnswer,
      itsImportantChecked
   );

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

   if (isLoading) {
      return <LoadingAnimation centeredMethod={CenteredMethod.Relative} />;
   }

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

export default React.memo(ThemesAsQuestionForm);
