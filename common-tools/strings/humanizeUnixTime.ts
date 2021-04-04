import I18n from "i18n-js";
import moment from "moment";

export function humanizeUnixTime(time: number): string {
   return moment.duration(time, "seconds").locale(I18n.locale).humanize();
}
