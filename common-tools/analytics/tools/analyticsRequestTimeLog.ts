import { analyticsLog } from "./analyticsLog";

export function analyticsResponseTimeLog(url: string, method: string, responseTimeMs: number) {
   const eventName = `response_time___${method}___${url.split("/").join("_").split("-").join("_")}`;
   const responseTimeSeconds = Math.ceil(responseTimeMs / 1000);
   analyticsLog(eventName, { responseTimeSeconds });
}
