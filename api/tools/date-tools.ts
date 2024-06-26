import moment from "moment";

export const HOUR_IN_SECONDS: number = 3600;
export const DAY_IN_SECONDS: number = HOUR_IN_SECONDS * 24;
export const YEAR_IN_SECONDS: number = DAY_IN_SECONDS * 365;
export const MONTHS_NUMBERS: number[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
export const MONTHS_NAMES: string[] = [
   "January",
   "February",
   "March",
   "April",
   "May",
   "June",
   "July",
   "August",
   "September",
   "October",
   "November",
   "December"
];

export function fromBirthDateToAge(birthDate: number): number {
   return Math.floor((moment().unix() - birthDate) / YEAR_IN_SECONDS);
}

export function fromAgeToBirthDate(age: number): number {
   return moment()
      .year(moment().year() - age - 1)
      .unix();
}
