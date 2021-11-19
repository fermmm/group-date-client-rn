import React, { FC, useEffect, useState } from "react";
import {
   TagBasicInfo,
   TagsAsQuestion
} from "../../../../api/server/shared-tools/endpoints-interfaces/tags";
import {
   CenteredMethod,
   LoadingAnimation
} from "../../../common/LoadingAnimation/LoadingAnimation";
import Question, { QuestionOnChange } from "../../../common/Question/Question";
import { OnChangeFormParams, TagsToUpdate } from "../RegistrationFormsPage";
import { useTagAsQuestionInfo } from "./hooks/useTagAsQuestionInfo";

export interface PropsTagsAsQuestionForm {
   formName: string;
   initialData: TagsInfo;
   questionId: string;
   mandatoryQuestion: boolean;
   tagsAsQuestions: TagsAsQuestion[];
   onChange: (props: OnChangeFormParams) => void;
}

export interface TagsInfo {
   tagsSubscribed?: TagBasicInfo[];
   tagsBlocked?: TagBasicInfo[];
}

const TagsAsQuestionForm: FC<PropsTagsAsQuestionForm> = props => {
   const { questionId, initialData, onChange, formName, mandatoryQuestion, tagsAsQuestions } =
      props;
   const [selectedAnswer, setSelectedAnswer] = useState<string>(null);
   const [itsImportantChecked, setItsImportantChecked] = useState<boolean>(null);
   const {
      isLoading,
      question,
      initiallySelectedAnswer,
      initiallyItsImportantChecked,
      tagsToUpdate,
      itsImportantSelectorInvisible
   } = useTagAsQuestionInfo(
      tagsAsQuestions,
      questionId,
      initialData,
      selectedAnswer,
      itsImportantChecked
   );

   useEffect(() => {
      onChange({ formName, error: mandatoryQuestion ? getError() : null, tagsToUpdate });
   }, [selectedAnswer, itsImportantChecked]);

   const handleQuestionChange = ({ selectedAnswer, itsImportantChecked }: QuestionOnChange) => {
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
         answers={question.answers.map((a, i) => ({
            text: a.text,
            id: a.tagId ?? `no tag ${String(i)}`
         }))}
         incompatibilitiesBetweenAnswers={question.incompatibilitiesBetweenAnswers}
         multipleAnswersAllowed={false}
         initiallySelected={[initiallySelectedAnswer]}
         initiallyItsImportantChecked={initiallyItsImportantChecked}
         itsImportantInvisible={itsImportantSelectorInvisible}
         onChange={handleQuestionChange}
      />
   );
};

export default React.memo(TagsAsQuestionForm);
