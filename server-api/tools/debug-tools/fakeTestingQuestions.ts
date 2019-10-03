export interface QuestionData {
   text: string;
   extraText?: string;
   multipleAnswersAllowed: boolean;
   selectedAnswers?: string[];
   itsImportantEnabled?: boolean;
   itsImportantSelectedByDefault?: boolean;
   answers: QuestionAnswerData[];
   incompatibilitiesBetweenAnswers?: { [key: string]: string[] };
}

export interface QuestionAnswerData {
   id: string;
   text: string;
   extraText?: string;
}

export const fakeTestingQuestions: QuestionData[] = [
   {
      text: "Tu dieta",
      multipleAnswersAllowed: false,
      itsImportantSelectedByDefault: false,
      answers: [
         {
            id: "0",
            text: "Omnívore",
            extraText: "(como de todo)"
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
         "1": ["0"],
         "2": ["0"],
         "3": ["0"]
      },
   },
   {
      text: "¿Estas de acuerdo con el feminismo?",
      extraText: "(con una o mas ramas del mismo)",
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
            text: "No estoy informade sobre el tema",
         },
      ],
      incompatibilitiesBetweenAnswers: {
         "0": ["1"],
         "1": ["0"]
      },
   },
   {
      text: "¿Que tipo de cuerpo tenés?",
      multipleAnswersAllowed: false,
      itsImportantEnabled: false,
      answers: [
         {
            id: "0",
            text: "Delgade / mas o menos delgade",
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
   },
   {
      text: "¿Que tipos de cuerpos te atraen?",
      multipleAnswersAllowed: true,
      itsImportantEnabled: false,
      answers: [
         {
            id: "0",
            text: "Delgade / mas o menos delgade",
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
   },
   {
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
   },
   {
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
            text: "Si no hay demasiado de eso si",
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
   },
   {
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
   },
   {
      text: "¿Con que pensamiento coincidís más?",
      multipleAnswersAllowed: false,
      itsImportantSelectedByDefault: true,
      answers: [
         {
            id: "0",
            text: "El mundo mejoraría si se distribuye dinero de las grandes fortunas",
            extraText: "/ Izquierda / Centro-izquierda"
         },
         {
            id: "1",
            text: "No se le debe quitar dinero a nadie ni regalárselo a quienes no hacen nada para ganarlo",
            extraText: "/ Derecha / Centro-derecha"
         }
      ],
      incompatibilitiesBetweenAnswers: {
         "0": ["1"],
         "1": ["0"]
      },
   },
   {
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
   },
   {
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
            text: "No muy sexual",
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
   }
];