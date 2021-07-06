import { analyticsLogEvent } from "../tools/analyticsLog";

export function logPolyHistory(timeVisible: number) {
   const eventName = "group_polyamory_history_text_read";
   analyticsLogEvent(eventName, {
      secondsViewing: timeVisible
   });
}
