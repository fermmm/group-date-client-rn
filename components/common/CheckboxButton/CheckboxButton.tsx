import React, { Component } from "react";
import { Checkbox } from "react-native-paper";
import RaddioButtonImproved, { RadioButtonImprovedProps } from "../RadioButtonImproved/RadioButtonImproved";

export default class CheckboxButton extends Component<RadioButtonImprovedProps> {
   render(): JSX.Element {
      return (
         <RaddioButtonImproved
            iconElement={(checked) => <Checkbox status={checked ? "checked" : "unchecked"}/>}
            {...this.props}
         >
            {this.props.children}
         </RaddioButtonImproved>
      );
   }
}