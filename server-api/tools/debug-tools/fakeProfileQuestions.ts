import { QuestionData } from "./interfaces/questions";

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
         text: "Otro / No binarie",
      },
   ]
};

const genderLikeQuestion: QuestionData = {
   text: "¿Qué géneros te atraen?",
   multipleAnswersAllowed: true,
   answers: [
      {
         id: "0",
         text: "Mujeres",
      },
      {
         id: "1",
         text: "Varones",
      },
      {
         id: "2",
         text: "Mujeres transexuales",
      },
      {
         id: "3",
         text: "Varones transexuales",
      },
      {
         id: "4",
         text: "Otros / No binaries",
      },
   ]
};

const intentionsQuestion: QuestionData = {
   text: "¿Qué te gustaría encontrar en las citas grupales que organiza esta app?",
   multipleAnswersAllowed: false,
   itsImportantSelectedByDefault: false,
   answers: [
      {
         id: "0",
         text: "Vinculos sexuales y de otros tipos",
      },
      {
         id: "1",
         text: "Vinculos sin intenciones sexuales",
      }
   ],
   incompatibilitiesBetweenAnswers: {
      "0": ["1"],
      "1": ["0"]
   },
};

export const fakeProfileQuestionsPart: QuestionData[] = [
   genderQuestion,
   genderLikeQuestion,
   intentionsQuestion,
];