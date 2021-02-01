import React, { FC, useEffect, useState } from "react";
import { UserPropsAsQuestionsTypes } from "../../../../api/server/shared-tools/endpoints-interfaces/user";
import { EditableUserProps } from "../../../../api/server/shared-tools/validators/user";
import { usePropsAsQuestions } from "../../../../api/server/user";
import {
   CenteredMethod,
   LoadingAnimation
} from "../../../common/LoadingAnimation/LoadingAnimation";
import Question, { QuestionOnChange } from "../../../common/Question/Question";

export interface PropsPropAsQuestionForm {
   formName: string;
   initialData?: EditableUserProps;
   propNamesToChange: string[];
   defaultValueForNonSelectedAnswers?: UserPropsAsQuestionsTypes;
   onChange: (formName: string, newProps: EditableUserProps, error: string | null) => void;
}

const PropAsQuestionForm: FC<PropsPropAsQuestionForm> = props => {
   const { initialData, propNamesToChange, defaultValueForNonSelectedAnswers, onChange } = props;
   const [newProps, setNewProps] = useState<EditableUserProps>(null);
   const { data: allPropsAsQuestions } = usePropsAsQuestions();
   useEffect(() => onChange(props.formName, newProps, getError()), [newProps, props.formName]);

   // Use the first propNamesToChange to find which question object will be used
   const question = allPropsAsQuestions?.find(
      q => q.answers.find(a => a.propName === propNamesToChange[0]) != null
   );

   const getError = (): string | null => {
      if (newProps == null) {
         return "Debes seleccionar una respuesta para continuar";
      }

      return null;
   };

   const handleQuestionChange = (changes: QuestionOnChange) => {
      let newProps: EditableUserProps = {};
      if (!question.multipleAnswersAllowed) {
         const answerSelected = question.answers.find(a => a.text === changes.selectedAnswer);
         if (answerSelected != null) {
            newProps[answerSelected.propName] = answerSelected.value;
         }
      } else {
         if (changes.selectedAnswerMultiple.length > 0) {
            question.answers.forEach(a => {
               const answerWasSelected: boolean = changes.selectedAnswerMultiple.includes(a.text);
               if (
                  answerWasSelected ||
                  (!answerWasSelected && defaultValueForNonSelectedAnswers != null)
               ) {
                  newProps[a.propName] = answerWasSelected
                     ? a.value
                     : defaultValueForNonSelectedAnswers;
               }
            });
         }
      }

      // Empty objects {} are tricky when writing ifs so we only can have an object with content or null
      if (Object.keys(newProps).length === 0) {
         newProps = null;
      }

      setNewProps(newProps);
   };

   const getInitiallySelectedOption = () => {
      /**
       * If the answer is present on initialData and the value is the same than in the answer then
       * is considered selected.
       */
      return question.answers
         .filter(a => initialData[a.propName] != null && initialData[a.propName] === a.value)
         .map(a => a.text);
   };

   if (!allPropsAsQuestions) {
      return <LoadingAnimation centeredMethod={CenteredMethod.Relative} />;
   }

   if (!question) {
      return null;
   }

   return (
      <Question
         questionText={question.text}
         answers={question.answers.map(a => ({ text: a.text, id: a.text }))}
         multipleAnswersAllowed={question.multipleAnswersAllowed}
         initiallySelected={getInitiallySelectedOption()}
         onChange={handleQuestionChange}
      />
   );
};

export default React.memo(PropAsQuestionForm);
