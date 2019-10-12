import { QuestionData } from "./interfaces/questions";

const conversationsQuestion: QuestionData = {
   text: "¿Te gustan las conversaciones intelectuales?",
   extraText: "(Ricas en reflexiones y/o información)",
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
         extraText: "(Como carne y también de origen vegetal)"
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
   ],
   incompatibilitiesBetweenAnswers: {
      "0": ["1", "2"],
      "2": ["0"]
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

const religionQuestion: QuestionData = {
   text: "¿Crees en el dios de la biblia?",
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
   ],
   incompatibilitiesBetweenAnswers: {
      "1": ["0"],
      "0": ["1"],
   },
};

const politicsQuestion: QuestionData = {
   text: "¿Qué pensas de la economía en la que vivimos?",
   multipleAnswersAllowed: false,
   itsImportantSelectedByDefault: true,
   answers: [
      {
         id: "0",
         text: "Es un sistema que nos oprime"
      },
      {
         id: "1",
         text: "Se debería distribuir mejor la riqueza",
      },
      {
         id: "2",
         text: "El éxito depende de lo que uno hace mas que del sistema económico",
      },
      {
         id: "3",
         text: "El estado lo arruina",
      },
      {
         id: "4",
         text: "El gobierno no debería regalar dinero a algunos, fomenta la vagancia",
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
      "0": ["2", "3", "4"],
      "1": ["2", "3", "4"],
      "2": ["0", "1"],
      "3": ["0", "1"],
      "4": ["0", "1"],
   },
};

const polyamoryQuestion: QuestionData = {
   text: "¿Tendrías una relación sexo-afectiva con mas de una persona a la vez?",
   multipleAnswersAllowed: false,
   itsImportantSelectedByDefault: true,
   answers: [
      {
         id: "0",
         text: "No",
      },
      {
         id: "1",
         text: "Si",
      },
      {
         id: "2",
         text: "Si, pero no al mismo tiempo",
         extraText: "(un día con cada une)",
      }
   ],
   incompatibilitiesBetweenAnswers: {
      "0": ["1", "2"],
      "1": ["0"],
      "2": ["0"]
   },
};

const unicornQuestion: QuestionData = {
   text: "¿Estás en la app en busca de una persona para sumar a tu pareja y hacer un trio?",
   extraText: "¿O buscas una pareja para eso?",
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
      }
   ],
   incompatibilitiesBetweenAnswers: {
      "0": ["1"],
      "1": ["0"],
   },
};

const sexDesireQuestion: QuestionData = {
   text: "¿Qué tan sexual te consideras?",
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
   conversationsQuestion,
   religionQuestion,
   feminismQuestion,
   dietQuestion,
   politicsConversationQuestion,
   politicsQuestion,
   unicornQuestion,
   sexDesireQuestion,
   polyamoryQuestion,
   groupSexQuestion,
];