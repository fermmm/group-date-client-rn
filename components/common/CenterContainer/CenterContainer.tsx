import React, { FC } from "react";
import { View } from "react-native";

const CenterContainer: FC = ({ children }) => {
   return <View style={{ alignItems: "center", justifyContent: "center" }}>{children}</View>;
};

export default CenterContainer;
