import React, { FC, useEffect, useState } from "react";
import posed from "react-native-pose";

export const LogoAnimator: FC = ({ children }) => {
   const [pose, setPose] = useState("origin");

   useEffect(() => {
      if (pose === "origin") {
         setTimeout(() => {
            setPose("destination");
         }, 100);
      }
   }, [pose]);

   return <AnimationContainer pose={pose}>{children}</AnimationContainer>;
};

const AnimationContainer = posed.View({
   origin: {
      scale: 15,
      rotate: "100deg",
      opacity: 0,
      transition: { duration: 0 }
   },
   destination: {
      scale: 1,
      rotate: "0deg",
      opacity: 1,
      transition: { duration: 3000 }
   }
});
