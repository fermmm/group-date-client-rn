import React, { FC } from "react";
import { LinearGradient } from "expo-linear-gradient";
import color from "color";
import { useTheme } from "../../../common-tools/themes/useTheme/useTheme";

interface PropsPageBackgroundGradient {
   visible?: boolean;
}

export const PageBackgroundGradient: FC<PropsPageBackgroundGradient> = ({
   children,
   visible = true
}) => {
   const { colors } = useTheme();

   if (!visible) {
      return null;
   }

   return (
      <LinearGradient
         style={{ flex: 1 }}
         locations={[0.7, 1]}
         colors={[
            color(colors.background).string(),
            color(colors.backgroundBottomGradient).string()
         ]}
      >
         {children}
      </LinearGradient>
   );
};
