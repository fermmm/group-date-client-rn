import { QuestionData } from "./interfaces/questions";

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

const musicQuestion: QuestionData = {
   text: "¿Te gusta escuchar la musica mas difundida?",
   extraText: "(Reggaeton y canciones románticas conocidas)",
   multipleAnswersAllowed: false,
   itsImportantSelectedByDefault: false,
   answers: [
      {
         id: "0",
         text: "Si",
      },
      {
         id: "1",
         text: "No, pero no me molesta",
      },
      {
         id: "2",
         text: "Me molesta",
      },
   ],
   incompatibilitiesBetweenAnswers: {
      "0": ["2"],
      "2": ["0"]
   },
};

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
   text: "¿Con que pensamiento coincidís más?",
   multipleAnswersAllowed: false,
   itsImportantSelectedByDefault: true,
   answers: [
      {
         id: "0",
         text: "El mundo mejoraría si se distribuye dinero de les que tienen grandes fortunas",
      },
      {
         id: "1",
         text: "No se le debe quitar su dinero a nadie. No se le debe regalar dinero a quienes no hacen nada para ganarlo",
      }
   ],
   incompatibilitiesBetweenAnswers: {
      "0": ["1"],
      "1": ["0"]
   },
};

const polyamoryQuestion: QuestionData = {
   text: "Te gustas con alguien, esa persona tambien se gusta con otre, ¿que crees que pensarías en esa situación?",
   multipleAnswersAllowed: false,
   itsImportantSelectedByDefault: true,
   answers: [
      {
         id: "0",
         text: "Tiene que elegir a une",
      },
      {
         id: "1",
         text: "Por mi que se relacione con les 2",
      },
      {
         id: "2",
         text: "Por mi que se relacione con les 2, pero en dias distintos",
      }
   ],
   incompatibilitiesBetweenAnswers: {
      "0": ["1", "2"],
      "1": ["0"],
      "2": ["0"]
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
         text: "Como el promedio",
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
   musicQuestion,
   politicsQuestion,
   sexDesireQuestion,
   polyamoryQuestion,
];