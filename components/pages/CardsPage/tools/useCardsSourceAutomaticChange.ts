import { useEffect, useState } from "react";
import { Alert } from "react-native";
import { User } from "../../../../api/server/shared-tools/endpoints-interfaces/user";
import { ParamsCardsPage } from "../CardsPage";
import { CardsSource } from "./types";

/**
 * Contains some useEffect to change the cards source when no more cards are left or when changed from params
 */
export function useCardsSourceAutomaticChange(props: UseCardsSourceProps) {
   const { cardsFromServer, params, cardsSource, setCardsSource } = props;

   // Effect that changes the card source when received on navigate params (currently only used for tags)
   useEffect(() => {
      if (params?.cardsSource != null) {
         setCardsSource(params.cardsSource);
      }
   }, [params]);

   // Effect to go back to recommendations when there are no more users on the current mode
   useEffect(() => {
      if (cardsSource === CardsSource.Recommendations) {
         return;
      }

      if (cardsFromServer == null) {
         return;
      }

      if (cardsFromServer.length > 0) {
         return;
      }

      if (cardsSource === CardsSource.DislikedUsers) {
         Alert.alert("", "No hay mas personas dejadas de lado para mostrar");
      }

      if (cardsSource === CardsSource.Tag) {
         Alert.alert("", `No hay mas personas para mostrar en ${params?.tagName}`);
      }

      setCardsSource(CardsSource.Recommendations);
   }, [cardsFromServer, cardsSource, params?.tagId]);

   return [cardsSource, setCardsSource];
}

interface UseCardsSourceProps {
   cardsFromServer: User[];
   params: ParamsCardsPage;
   cardsSource: CardsSource;
   setCardsSource: React.Dispatch<React.SetStateAction<CardsSource>>;
}
