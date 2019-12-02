import { QuestionData } from "./interfaces/questions";

const groupSexQuestion: QuestionData = {
   text: "¿Qué pensas del sexo grupal?",
   shortVersion: "Su opinión sobre el sexo grupal",
   answers: [
      {
         id: "0",
         text: "No me molesta / Me gustaría probar",
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

const smokeQuestion: QuestionData = {
   text: "¿Fumas? (tabaco)",
   shortVersion: "Fuma",
   answers: [
      {
         id: "0",
         text: "No",
      },
      {
         id: "1",
         text: "Muy poco",
      },
      {
         id: "2",
         text: "Si",
      }
   ]
};

const politicsQuestion: QuestionData = {
   text: "¿Cuál es tu postura política?",
   extraText: "Puede ser incómoda la pregunta pero es importante para la mayoría de personas consultadas",
   shortVersion: "Su postura política",
   itsImportantSelectedByDefault: true,
   answers: [
      {
         id: "0",
         text: "No es un tema para hablar en una cita",
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
      },
   ],
   incompatibilitiesBetweenAnswers: {
      "1": ["2"],
      "2": ["1"]
   },
};

export const fakeFilterQuestions: QuestionData[] = [
   groupSexQuestion,
   smokeQuestion,
   politicsQuestion,
];