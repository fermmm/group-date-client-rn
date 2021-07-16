import React, { FC, useRef } from "react";
import { getNearestMultiple, removeDigitsFromNumber } from "../../../common-tools/math/math-tools";
import VisibilitySensor from "../VisibilitySensor/VisibilitySensor";

interface PropsAnalyticsTrackWhenVisible {
   /* Max seconds to register, Default = No limit */
   maxSecondsToRegister?: number;
   /* The interval to register, example: 5 will register 6 as 5 and 13 as 10. 5-10-15... Default = 3 */
   secondPeriods?: number;
   onLogShouldSend: (timeVisible: number) => void;
}

const AnalyticsTrackWhenVisible: FC<PropsAnalyticsTrackWhenVisible> = ({
   maxSecondsToRegister,
   secondPeriods = 3,
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
         const timeToLog = getTimeToLogInFinalFormat(maxTimeRegistered.current);
         if (lastSentTime.current != timeToLog) {
            onLogShouldSend(timeToLog);
            lastSentTime.current = timeToLog;
         }
      }
   };

   const getTimeToLogInFinalFormat = (timeToLogInMs: number) => {
      // Convert to seconds
      let timeToLog = Math.round(timeToLogInMs / 1000);

      if (maxSecondsToRegister != null && timeToLog > maxSecondsToRegister) {
         timeToLog = maxSecondsToRegister;
      }

      if (secondPeriods != null) {
         timeToLog = getNearestMultiple(timeToLog, secondPeriods);
      }

      return timeToLog;
   };

   return (
      <VisibilitySensor onVisibilityChange={onVisibilityChange} onDismount={onDismount}>
         {children}
      </VisibilitySensor>
   );
};

export default AnalyticsTrackWhenVisible;
