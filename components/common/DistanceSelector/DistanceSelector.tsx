import React, { FC, useMemo } from "react";
import { StyleSheet } from "react-native";
import { Styles } from "../../../common-tools/ts-tools/Styles";
import { DEFAULT_TARGET_DISTANCE, AVAILABLE_DISTANCES } from "../../../config";
import Picker from "../Picker/Picker";

export interface PropsDistanceSelector {
   value: number;
   onChange(newValue: number): void;
}

const DistanceSelector: FC<PropsDistanceSelector> = props => {
   const distanceToString = (distance: number) => {
      return `${distance} Km ${distance === DEFAULT_TARGET_DISTANCE ? " (Recomendado)" : ""}`;
   };

   const distanceOptions = useMemo(
      () =>
         AVAILABLE_DISTANCES.map(distance => ({
            label: distanceToString(distance),
            value: distance
         })),
      []
   );

   return (
      <Picker
         items={distanceOptions}
         value={props.value}
         onChange={itemValue => props.onChange(Number(itemValue))}
      />
   );
};

const styles: Styles = StyleSheet.create({
   mainContainer: {}
});

export default DistanceSelector;
