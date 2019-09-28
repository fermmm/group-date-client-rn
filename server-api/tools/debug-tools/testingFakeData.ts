export interface VotingOption {
   textLine1: string;
   textLine2?: string;
   votersAmmount: number;
   votersNames: string[];
}

export const testingLocationVotingData: VotingOption[] = [
   {
      textLine1: "Mate + porro en Parque Centenario",
      textLine2: "Dirección: Av. Angel Gallardo 400",
      votersAmmount: 3,
      votersNames: ["johnny", "maluma", "alberto666"],
   },
   {
      textLine1: "Garage Bar",
      textLine2: "Dirección: Chile 631",
      votersAmmount: 2,
      votersNames: ["johnny", "maluma"],
   },
   {
      textLine1: "Bar La Cigale",
      textLine2: "Dirección: 25 de Mayo 597",
      votersAmmount: 2,
      votersNames: ["maluma", "alberto666"],
   },
   {
      textLine1: "Museo de cera",
      textLine2: "Dirección: Defensa 1295 entre San Juan y Cochabamba",
      votersAmmount: 1,
      votersNames: ["maluma"],
   },
];

export const testingDayVotingData: VotingOption[] = [
   {
      textLine1: "Este Sábado (28 de Septiembre)",
      textLine2: "A las 18:00",
      votersAmmount: 3,
      votersNames: ["johnny", "maluma", "alberto666"],
   },
   {
      textLine1: "Este Sábado (28 de Septiembre)",
      textLine2: "A las 23:00",
      votersAmmount: 2,
      votersNames: ["johnny", "alberto666"],
   },
   {
      textLine1: "Este Viernes (27 de Septiembre)",
      textLine2: "A las 18:00",
      votersAmmount: 2,
      votersNames: ["maluma", "alberto666"],
   },
   {
      textLine1: "Este Domingo (28 de Septiembre)",
      textLine2: "A las 17:00",
      votersAmmount: 1,
      votersNames: ["alberto666"],
   },
   {
      textLine1: "Este Domingo (28 de Septiembre)",
      textLine2: "A las 22:00",
      votersAmmount: 0,
      votersNames: [],
   },
];