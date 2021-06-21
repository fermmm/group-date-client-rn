import * as Analytics from "expo-firebase-analytics";

export function logPolyHistory(timeVisible: number) {
   const eventName = "group_polyamory_history_text_read";

   console.log("Analytics log:", eventName);

   Analytics.logEvent(eventName, {
      timeReading: timeVisible
   });
}
