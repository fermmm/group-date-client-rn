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
         extraText: "(como carne)"
      },
      {
         id: "1",
         text: "Vegetariane",
      },
      {
         id: "2",
         text: "Vegane",
      },
      {
         id: "3",
         text: "Crudi-vegane",
      },
   ],
   incompatibilitiesBetweenAnswers: {
      "0": ["1", "2", "3"],
      "1": ["0"],
      "2": ["0"],
      "3": ["0"]
   },
};

const feminismQuestion: QuestionData = {
   text: "¿Estas de acuerdo con el feminismo?",
   extraText: "(con cualquier rama del mismo)",
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
         text: "No estoy informade",
      },
   ],
   incompatibilitiesBetweenAnswers: {
      "0": ["1"],
      "1": ["0"]
   },
};



const religionQuestion: QuestionData = {
   text: "¿Crees en dios?",
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
   text: "¿Con cuál de estos pensamientos ideológicos estás mas de acuerdo?",
   multipleAnswersAllowed: false,
   itsImportantSelectedByDefault: true,
   answers: [
      {
         id: "0",
         text: "El mundo mejoraría si se distribuye dinero de les que tienen grandes fortunas",
      },
      {
         id: "1",
         text: "No se le debe quitar su dinero a las fortunas ni a nadie. Tampoco esta bien regalarle dinero a quienes no hacen nada para ganarlo",
      }
   ],
   incompatibilitiesBetweenAnswers: {
      "0": ["1"],
      "1": ["0"]
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
   extraText: "¿O sos alguien que busca una pareja con ese fin?",
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

export const fakeFilterQuestions: QuestionData[] = [
   conversationsQuestion,
   religionQuestion,
   feminismQuestion,
   dietQuestion,
   politicsQuestion,
   unicornQuestion,
   sexDesireQuestion,
   polyamoryQuestion,
];