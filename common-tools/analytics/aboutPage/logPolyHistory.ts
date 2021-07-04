import { analyticsLog } from "../tools/analyticsLog";

export function logPolyHistory(timeVisible: number) {
   const eventName = "group_polyamory_history_text_read";
   analyticsLog(eventName, {
      secondsViewing: timeVisible
   });
}
