import { QuestionData } from "../../typings/endpoints-interfaces/questions";

const sexIntentionsQuestion: QuestionData = {
   text: "¿Estás abierte a relacionarte sexualmente?",
   shortVersion: "Abierte a relacionarse sexualmente",
   answers: [
      {
         id: "0",
         text: "Si"
      },
      {
         id: "1",
         text: "No, no quiero relacionarme sexualmente"
      }
   ],
   incompatibilitiesBetweenAnswers: {
      "0": ["1"],
      "1": ["0"]
   }
};

const feminismQuestion: QuestionData = {
   text: "¿Estás de acuerdo con el feminismo en general?",
   extraText: "O con algún movimiento feminista",
   shortVersion: "Está de acuerdo con algún feminismo",
   answers: [
      {
         id: "0",
         text: "Si, muy de acuerdo"
      },
      {
         id: "1",
         text: "Podría ser en alguna cosa, pero en general no"
      },
      {
         id: "2",
         text: "No sé nada sobre el tema"
      },
      {
         id: "3",
         text: "No me interesa / No me parece importante"
      },
      {
         id: "4",
         text: "No estoy de acuerdo con el feminismo para nada"
      }
   ],
   incompatibilitiesBetweenAnswers: {
      "0": ["1", "2", "3", "4"],
      "1": ["0"],
      "2": ["0"],
      "3": ["0"],
      "4": ["0"]
   }
};

const groupSexQuestion: QuestionData = {
   text: "¿Qué pensas del sexo grupal?",
   shortVersion: "Su opinión sobre el sexo grupal",
   answers: [
      {
         id: "0",
         text: "No me molesta / Me gustaría probar"
      },
      {
         id: "1",
         text: "Me gustó, lo haría de nuevo"
      },
      {
         id: "2",
         text: "No lo se / Prefiero no opinar"
      },
      {
         id: "3",
         text: "No me interesa"
      }
   ],
   incompatibilitiesBetweenAnswers: {
      "0": ["3"],
      "1": ["3"],
      "3": ["0", "1"]
   }
};

const smokeQuestion: QuestionData = {
   text: "¿Fumas? (tabaco)",
   shortVersion: "Fuma",
   answers: [
      {
         id: "0",
         text: "No"
      },
      {
         id: "1",
         text: "Muy poco"
      },
      {
         id: "2",
         text: "Si"
      }
   ]
};

const politicsQuestion: QuestionData = {
   text: "¿Cuál es tu postura política?",
   extraText:
      "Puede ser incómoda la pregunta pero es importante para la mayoría de personas consultadas",
   shortVersion: "Su postura política",
   itsImportantSelectedByDefault: true,
   answers: [
      {
         id: "0",
         text: "No es un tema para hablar en una cita"
      },
      {
         id: "1",
         text: "Libre mercado / Centro-derecha / Derecha / Otras cercanas",
         shortVersion: "Libre mercado / Derecha / Otras"
      },
      {
         id: "2",
         text: "Socialismo / Centro-izquierda / Izquierda / Anarquismo / Otras cercanas",
         shortVersion: "Izquierda / Otras"
      },
      {
         id: "3",
         text: "Otra"
      }
   ],
   incompatibilitiesBetweenAnswers: {
      "1": ["2"],
      "2": ["1"]
   }
};

/**
 * Esta pregunta setea isCoupleProfile
 */
/**
 * Translations
 * "If you go to a group date from this app, do you plan to go with someone?": "Si vas a una cita grupal en esta app ¿Tienes pensado ir con alguien?",
 *  "Would go on the date with": "Iría a la cita con",
 *  "Just me": "Solo yo",
 *  "With my couple": "Con mi pareja",
 */
const companyQuestion: QuestionData = {
   questionId: 0,
   affectsCardsGameOrdering: false,
   text: "If you go to a group date from this app, do you plan to go with someone?",
   shortVersion: "Would go on the date with",
   answers: [
      {
         answerId: 0,
         text: "Just me"
      },
      {
         answerId: 1,
         text: "With my couple"
      }
   ]
};

export const fakeFilterQuestions: QuestionData[] = [
   // sexIntentionsQuestion,
   feminismQuestion,
   groupSexQuestion,
   // smokeQuestion,
   politicsQuestion
];
