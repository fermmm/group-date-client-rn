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
   extraText: "Puede que surga este tema de conversación en una cita grupal",
   multipleAnswersAllowed: false,
   itsImportantSelectedByDefault: true,
   answers: [
      {
         id: "0",
         text: "Libre mercado / Centro-derecha / Derecha",
      },
      {
         id: "1",
         text: "Socialismo / Centro-izquierda / Izquierda",
      },
      {
         id: "2",
         text: "Otra"
      },
      {
         id: "3",
         text: "Prefiero no responder"
      },
      {
         id: "4",
         text: "En esta app no me parece importante decirlo"
      },
   ],
   incompatibilitiesBetweenAnswers: {
      "0": ["1"],
      "1": ["0"]
   },
};

const politicsQuestion2: QuestionData = {
   text: "¿Consideras que la mayoría de los pobres son pobres por que no se esfuerzan de la mejor manera?",
   extraText: "Este es un tema de conversación delicado que puede surgir",
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
         text: "Prefiero no opinar del tema"
      },
      {
         id: "3",
         text: "En esta app no me parece importante opinar de esto"
      },
   ],
   incompatibilitiesBetweenAnswers: {
      "0": ["1"],
      "1": ["0"]
   },
};

export const fakeFilterQuestions: QuestionData[] = [
   groupSexQuestion,
   smokeQuestion,
   politicsQuestion,
   politicsQuestion2,
];