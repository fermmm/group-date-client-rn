import React, { FC } from "react";
import { View } from "react-native";

export interface PropsEmptySpace {
   height?: number;
}

const EmptySpace: FC<PropsEmptySpace> = props => {
   return (
      <View
         style={{
            height: props.height == null ? 25 : props.height
         }}
      />
   );
};

export default EmptySpace;
