import { QuestionData } from "./interfaces/questions";

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

const smokeQuestion: QuestionData = {
   text: "¿Fumas? (tabaco)",
   multipleAnswersAllowed: false,
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
   extraText: "Puede ser incómoda la pregunta pero es clave para la mayoría de personas consultadas",
   multipleAnswersAllowed: false,
   itsImportantSelectedByDefault: true,
   answers: [
      {
         id: "0",
         text: "No es un tema para hablar en una cita"
      },
      {
         id: "1",
         text: "Libre mercado / Centro-derecha / Derecha",
      },
      {
         id: "2",
         text: "Socialismo / Centro-izquierda / Izquierda / Anarquismo / Otra cercana",
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