import { analyticsLogEvent } from "./analyticsLog";

export function analyticsResponseTimeLog(url: string, method: string, responseTimeMs: number) {
   const eventName = `response_time___${method}___${url}`;
   const responseTimeSeconds = Math.ceil(responseTimeMs / 1000);
   analyticsLogEvent(eventName, { responseTimeSeconds: `${responseTimeSeconds}sec` });
}
