import React, { FC, useEffect, useState } from "react";
import { useQuestions } from "../../../../api/server/user";
import {
   CenteredMethod,
   LoadingAnimation
} from "../../../common/LoadingAnimation/LoadingAnimation";
import Question, { QuestionOnChange } from "../../../common/Question/Question";
import { OnChangeFormParams } from "../RegistrationFormsPage";

export interface PropsQuestionForm {
   formName: string;
   questionId: string;
   /** The answer id initially selected if any */
   initialData?: string;
   onChange: (props: OnChangeFormParams) => void;
}

const QuestionForm: FC<PropsQuestionForm> = props => {
   const { questionId, initialData, onChange, formName } = props;
   const [selectedAnswer, setSelectedAnswer] = useState<string>(null);
   const { data: questionsData } = useQuestions();
   const question = questionsData?.find(q => q.questionId === questionId);

   useEffect(() => {
      onChange({ formName, error: getError(), answerId: selectedAnswer });
   }, [selectedAnswer]);

   const handleQuestionChange = ({ selectedAnswer, itsImportantChecked }: QuestionOnChange) => {
      setSelectedAnswer(selectedAnswer);
   };

   const getError = (): string | null => {
      if (selectedAnswer == null) {
         return "Debes seleccionar una respuesta para continuar";
      }

      return null;
   };

   if (!questionsData) {
      return <LoadingAnimation centeredMethod={CenteredMethod.Relative} />;
   }

   return (
      <Question
         questionText={question.text}
         answers={question.answers.map((a, i) => ({
            text: a.text,
            id: a.answerId
         }))}
         initiallySelected={[initialData]}
         onChange={handleQuestionChange}
         // The following props are features that used to work but now the system changed and became "not implemented"
         itsImportantInvisible={false}
         multipleAnswersAllowed={false}
         incompatibilitiesBetweenAnswers={null}
      />
   );
};

export default React.memo(QuestionForm);
