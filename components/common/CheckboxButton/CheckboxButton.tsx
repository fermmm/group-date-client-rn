import React, { FC } from "react";
import { Checkbox } from "react-native-paper";
import RadioButtonImproved, {
   RadioButtonImprovedProps
} from "../RadioButtonImproved/RadioButtonImproved";

const CheckboxButton: FC<RadioButtonImprovedProps> = props => {
   return (
      <RadioButtonImproved
         iconElement={checked => <Checkbox.Android status={checked ? "checked" : "unchecked"} />}
         {...props}
      >
         {props.children}
      </RadioButtonImproved>
   );
};

export default CheckboxButton;
