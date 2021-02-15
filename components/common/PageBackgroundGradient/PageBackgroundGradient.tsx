import React, { FC } from "react";
import { LinearGradient } from "expo-linear-gradient";
import color from "color";
import { useTheme } from "../../../common-tools/themes/useTheme/useTheme";

export const PageBackgroundGradient: FC = ({ children }) => {
   const { colors } = useTheme();

   return (
      <LinearGradient
         style={{ flex: 1 }}
         locations={[0.7, 1]}
         colors={[
            color(colors.background).string(),
            color(colors.backgroundBottomGradient).alpha(1).string()
         ]}
      >
         {children}
      </LinearGradient>
   );
};
