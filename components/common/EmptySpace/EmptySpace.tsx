import React, { PureComponent } from "react";
import { View } from "react-native";

export interface EmptySpaceProps {
   height?: number;
}

class EmptySpace extends PureComponent<EmptySpaceProps> {
   render(): JSX.Element {
      return (
         <View style={{
               height: this.props.height == null ? 25 : this.props.height
            }}
         />
      );
   }
}

export default EmptySpace;