import React, { FC } from "react";
import LottieView from "lottie-react-native";

interface PropsLoadingAnimation {
   visible: boolean;
}

export const LoadingAnimation: FC<PropsLoadingAnimation> = ({ visible }) => {
   if (!visible) {
      return null;
   }
   return <LottieView source={require("./loader.json")} autoPlay loop />;
};
