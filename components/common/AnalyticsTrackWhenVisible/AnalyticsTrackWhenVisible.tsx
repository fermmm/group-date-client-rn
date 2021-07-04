import React, { FC, useRef } from "react";
import { removeDigitsFromNumber } from "../../../common-tools/math/math-tools";
import VisibilitySensor from "../VisibilitySensor/VisibilitySensor";

interface PropsAnalyticsTrackWhenVisible {
   onLogShouldSend: (timeVisible: number) => void;
}

const AnalyticsTrackWhenVisible: FC<PropsAnalyticsTrackWhenVisible> = ({
   children,
   onLogShouldSend
}) => {
   const maxTimeRegistered = useRef(0);
   const lastSentTime = useRef<number>(null);
   const startTime = useRef<number>(null);

   /* Measure and store the maximum time the component was visible */
   const onVisibilityChange = (visible: boolean) => {
      if (visible) {
         startTime.current = new Date().getTime();
      } else {
         if (startTime.current == null) {
            return;
         }
         const timeElapsed = new Date().getTime() - startTime.current;
         if (timeElapsed > maxTimeRegistered.current) {
            maxTimeRegistered.current = timeElapsed;
         }
         startTime.current = null;
      }
   };

   const onDismount = () => {
      if (maxTimeRegistered.current > 0) {
         const timeToLog = Math.round(maxTimeRegistered.current / 1000);
         if (lastSentTime.current != timeToLog) {
            onLogShouldSend(timeToLog);
            lastSentTime.current = timeToLog;
         }
      }
   };

   return (
      <VisibilitySensor onVisibilityChange={onVisibilityChange} onDismount={onDismount}>
         {children}
      </VisibilitySensor>
   );
};

export default AnalyticsTrackWhenVisible;
