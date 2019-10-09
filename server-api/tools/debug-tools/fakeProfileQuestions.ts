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
   extraText: 'Cis singnifica: "no transexual"',
   multipleAnswersAllowed: false,
   answers: [
      {
         id: "0",
         text: "Mujer",
         extraText: "(cis)"
      },
      {
         id: "1",
         text: "Varon",
         extraText: "(cis)"
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
         text: "Mujer cis y también varon transexual",
      },
      {
         id: "5",
         text: "Varon cis y también mujer transexual",
      },
      {
         id: "6",
         text: "Otro",
      },
   ]
};

const genderLikeQuestion: QuestionData = {
   text: "¿Qué géneros te atraen y te gustaría ver en la aplicación?",
   multipleAnswersAllowed: true,
   answers: [
      {
         id: "0",
         text: "Mujer",
         extraText: "(cis)"
      },
      {
         id: "1",
         text: "Varon",
         extraText: "(cis)"
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
         text: "Otro",
      },
   ]
};

const bodyQuestion: QuestionData = {
   text: "¿Cuál es tu tipo de cuerpo?",
   multipleAnswersAllowed: false,
   answers: [
      {
         id: "0",
         text: "Delgade",
         extraText: "o mas o menos delgade"
      },
      {
         id: "1",
         text: "Un poco rellenite",
      },
      {
         id: "2",
         text: "Gordite",
      },
      {
         id: "3",
         text: "Gorde",
      },
      {
         id: "4",
         text: "Atletique",
      },
   ]
};

const bodyLikeQuestion: QuestionData = {
   text: "¿Qué tipos de cuerpos te atraen?",
   multipleAnswersAllowed: true,
   answers: [
      {
         id: "0",
         text: "Delgade",
         extraText: "o mas o menos delgade"
      },
      {
         id: "1",
         text: "Un poco rellenite",
      },
      {
         id: "2",
         text: "Gordite",
      },
      {
         id: "3",
         text: "Gorde",
      },
      {
         id: "4",
         text: "Atletique",
      },
   ]
};

export const fakeProfileQuestionsPart: QuestionData[] = [
   intentionsQuestion,
   genderQuestion,
   genderLikeQuestion,
   bodyQuestion,
   bodyLikeQuestion,
];