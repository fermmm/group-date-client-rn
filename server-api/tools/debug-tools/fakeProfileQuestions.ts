import { QuestionData } from "./interfaces/questions";

const intentionsQuestion: QuestionData = {
   text: "¿Qué te gustaría hacer en las citas grupales que organiza esta app?",
   multipleAnswersAllowed: false,
   itsImportantSelectedByDefault: true,
   answers: [
      {
         id: "1",
         text: "Conocer gente con posibilidades de vincularse sexualmente",
      },
      {
         id: "0",
         text: "Conocer gente pero sin intenciones sexuales, solo amistad",
      }
   ],
   incompatibilitiesBetweenAnswers: {
      "0": ["1"],
      "1": ["0"]
   },
};

const genderQuestion: QuestionData = {
   text: "¿Cual es tu género?",
   multipleAnswersAllowed: false,
   answers: [
      {
         id: "0",
         text: "Mujer",
      },
      {
         id: "1",
         text: "Varon",
      },
      {
         id: "2",
         text: "Mujer transexual",
      },
      {
         id: "3",
         text: "Varon transexual",
      },
      {
         id: "4",
         text: "No binarie",
      },
   ]
};

const genderLikeQuestion: QuestionData = {
   text: "¿Qué géneros te atraen y/o te gustaría ver en la aplicación?",
   multipleAnswersAllowed: true,
   answers: [
      {
         id: "0",
         text: "Mujer",
      },
      {
         id: "1",
         text: "Varon",
      },
      {
         id: "2",
         text: "Mujer transexual",
      },
      {
         id: "3",
         text: "Varon transexual",
      },
      {
         id: "4",
         text: "No binarie",
      },
   ]
};

export const fakeProfileQuestionsPart: QuestionData[] = [
   intentionsQuestion,
   genderQuestion,
   genderLikeQuestion,
];