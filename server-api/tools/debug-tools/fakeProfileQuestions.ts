import { QuestionData } from "./interfaces/questions";

const genderQuestion: QuestionData = {
   text: "¿Cual es tu categoría de género?",
   multipleAnswersAllowed: false,
   answers: [
      {
         id: "0",
         text: "Mujer cis",
         extraText: 'Cis singnifica "no transexual"'
      },
      {
         id: "1",
         text: "Varon cis",
         extraText: 'Cis singnifica "no transexual"'
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
         text: "Otra",
      },
   ]
};

const genderLikeQuestion: QuestionData = {
   text: "¿Qué categorías de género te atraen sexualmente?",
   multipleAnswersAllowed: true,
   answers: [
      {
         id: "0",
         text: "Mujer cis",
      },
      {
         id: "1",
         text: "Varon cis",
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
         text: "Otra",
      },
   ]
};

const dateWeekendQuestion: QuestionData = {
   text: "¿Los fines de semana es probable que puedas ir a una cita?",
   multipleAnswersAllowed: false,
   answers: [
      {
         id: "0",
         text: "No",
      },
      {
         id: "1",
         text: "Si, a cualquier hora",
      },
      {
         id: "2",
         text: "Si, de la tarde en adelante",
      },
      {
         id: "3",
         text: "Si, a la noche",
      }
   ],
   defaultSelectedAnswers: [
      "2"
   ]
};

const dateWeekQuestion: QuestionData = {
   text: "¿Los dias de semana es probable que puedas ir a una cita?",
   multipleAnswersAllowed: false,
   answers: [
      {
         id: "0",
         text: "No",
      },
      {
         id: "1",
         text: "Si, a cualquier hora",
      },
      {
         id: "2",
         text: "Si, de las 19 en adelante",
      },
      {
         id: "3",
         text: "Si, a la noche",
      }
   ],
   defaultSelectedAnswers: [
      "2"
   ]
};

const bodyQuestion: QuestionData = {
   text: "¿Que tipo de cuerpo tenés?",
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
   text: "¿Que tipo de cuerpos te atraen?",
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

export const fakeProfileQuestionsPart1: QuestionData[] = [
   genderQuestion,
   genderLikeQuestion,
   dateWeekendQuestion,
   dateWeekQuestion
];

export const fakeProfileQuestionsPart2: QuestionData[] = [
   bodyQuestion,
   bodyLikeQuestion
];