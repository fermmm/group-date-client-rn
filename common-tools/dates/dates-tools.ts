import i18n from "i18n-js";

/**
 * Returns a date in readable format, example: "November 26"
 * Uses localization from i18n package.
 *
 * @param unixDate Unix date in seconds
 */
export function dayAndMonthFromUnixDate(unixDate: number): string {
   if (unixDate == null) {
      return null;
   }

   const options: Intl.DateTimeFormatOptions = {
      day: "numeric",
      month: "long"
   };

   return new Intl.DateTimeFormat(i18n.locale, options).format(new Date(unixDate * 1000));
}

/**
 * Returns a date in readable format, example: "November 26, 2020"
 * Uses localization from i18n package.
 *
 * @param unixDate Unix date in seconds
 */
export function readableDateFromUnixDate(unixDate: number, language: string = "en-US"): string {
   if (unixDate == null) {
      return null;
   }

   const options: Intl.DateTimeFormatOptions = {
      day: "numeric",
      month: "long",
      year: "numeric"
   };

   return new Intl.DateTimeFormat(language, options).format(new Date(unixDate * 1000));
}
