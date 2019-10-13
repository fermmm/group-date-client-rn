import { QuestionData } from "./interfaces/questions";

const polyamoryQuestion: QuestionData = {
   text: "¿Tendrías una relación sexo-afectiva compuesta por 3 o mas personas donde se juntan todes a la vez?",
   multipleAnswersAllowed: false,
   itsImportantSelectedByDefault: true,
   answers: [
      {
         id: "0",
         text: "No, de a 2 únicamente",
      },
      {
         id: "1",
         text: "Si",
      }
   ],
   incompatibilitiesBetweenAnswers: {
      "0": ["1"],
      "1": ["0"],
   },
};

const conversationsQuestion: QuestionData = {
   text: "¿Te gustan las conversaciones intelectuales?",
   multipleAnswersAllowed: false,
   itsImportantSelectedByDefault: false,
   answers: [
      {
         id: "0",
         text: "No",
      },
      {
         id: "1",
         text: "Un poco",
      },
      {
         id: "2",
         text: "Si, me gustan mucho",
      },
   ],
   incompatibilitiesBetweenAnswers: {
      "0": ["2"],
      "2": ["0"],
   },
};

const dietQuestion: QuestionData = {
   text: "¿Cuál es tu dieta?",
   multipleAnswersAllowed: false,
   itsImportantSelectedByDefault: false,
   answers: [
      {
         id: "0",
         text: "Omnívore",
      },
      {
         id: "1",
         text: "Vegetariane",
      },
      {
         id: "2",
         text: "Vegane",
      }
   ],
   incompatibilitiesBetweenAnswers: {
      "0": ["1", "2"],
      "1": ["0"],
      "2": ["0"]
   },
};

const politicsConversationQuestion: QuestionData = {
   text: "¿Te gusta hablar de política?",
   multipleAnswersAllowed: false,
   itsImportantSelectedByDefault: false,
   answers: [
      {
         id: "0",
         text: "No",
      },
      {
         id: "1",
         text: "Un poco",
      },
      {
         id: "2",
         text: "Si",
      },
   ]
};

const politicsQuestion: QuestionData = {
   text: "¿Qué pensas sobre el sistema economico en el que vivimos?",
   multipleAnswersAllowed: false,
   itsImportantSelectedByDefault: true,
   answers: [
      {
         id: "0",
         text: "El éxito depende de lo que uno hace, poco importa el sistema económico",
      },
      {
         id: "1",
         text: "El estado gasta demasiado",
      },
      {
         id: "2",
         text: "Las ayudas economicas hacen que algunos no trabajen",
      },
      {
         id: "3",
         text: "Estamos oprimidos por el sistema"
      },
      {
         id: "4",
         text: "Se debería distribuir mejor la riqueza",
      },
      {
         id: "5",
         text: "No lo se"
      },
      {
         id: "6",
         text: "No me importa"
      },
      {
         id: "7",
         text: "Otra"
      }
   ],
   incompatibilitiesBetweenAnswers: {
      "0": ["3", "4"],
      "1": ["3", "4"],
      "2": ["3", "4"],
      "3": ["0", "1", "2"],
      "4": ["0", "1", "2"],
   },
};

const feminismQuestion: QuestionData = {
   text: "¿Estas de acuerdo con el feminismo?",
   extraText: "(Con cualquier rama del mismo)",
   multipleAnswersAllowed: false,
   itsImportantSelectedByDefault: true,
   answers: [
      {
         id: "0",
         text: "Si",
      },
      {
         id: "1",
         text: "No",
      },
      {
         id: "2",
         text: "No estoy informade / No estoy interesade",
      },
   ],
   incompatibilitiesBetweenAnswers: {
      "0": ["1"],
      "1": ["0"]
   },
};

const bodyQuestion: QuestionData = {
   text: "¿Tenés un tamaño mas o menos aceptado por el ideal hegemónico impuesto? (Un cuerpo mas o menos delgado)",
   multipleAnswersAllowed: false,
   itsImportantSelectedByDefault: false,
   answers: [
      {
         id: "0",
         text: "Si",
      },
      {
         id: "1",
         text: "No",
      },
   ],
   incompatibilitiesBetweenAnswers: {
      "0": ["1"],
      "1": ["0"]
   },
};

const sexDesireQuestion: QuestionData = {
   text: "¿Qué tan sexual te considerás?",
   multipleAnswersAllowed: false,
   itsImportantSelectedByDefault: true,
   answers: [
      {
         id: "0",
         text: "Bastante sexual",
      },
      {
         id: "1",
         text: "Ni mucho ni poco sexual",
      },
      {
         id: "2",
         text: "Poco sexual",
      },
      {
         id: "3",
         text: "Asexual",
      }
   ],
   incompatibilitiesBetweenAnswers: {
      "0": ["2", "3"],
      "1": ["2", "3"],
      "2": ["0", "1"],
      "3": ["0", "1"]
   },
};

const groupSexQuestion: QuestionData = {
   text: "¿Qué pensas del sexo grupal?",
   multipleAnswersAllowed: false,
   itsImportantSelectedByDefault: false,
   answers: [
      {
         id: "0",
         text: "Me gustaría probar",
      },
      {
         id: "1",
         text: "Me gustó, lo haría de nuevo",
      },
      {
         id: "2",
         text: "No lo se / Prefiero no opinar",
      },
      {
         id: "3",
         text: "No me interesa",
      }
   ],
   incompatibilitiesBetweenAnswers: {
      "0": ["3"],
      "1": ["3"],
      "3": ["0", "1"],
   },
};

export const fakeFilterQuestions: QuestionData[] = [
   polyamoryQuestion,
   conversationsQuestion,
   feminismQuestion,
   bodyQuestion,
   dietQuestion,
   politicsConversationQuestion,
   politicsQuestion,
   sexDesireQuestion,
   groupSexQuestion,
];