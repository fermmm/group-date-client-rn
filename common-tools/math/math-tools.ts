export function removeDigitsFromNumber(
   number: number,
   options?: RemoveDigitsFromNumberOptions
): number {
   let { digitsToKeepInDecimalPart, digitsToKeepInIntegerPart } = options ?? {};

   let numStr = String(number);
   const numParts = numStr.split(".");

   if (digitsToKeepInDecimalPart != null && numParts.length > 1) {
      numParts[1] = numParts[1].substring(0, digitsToKeepInDecimalPart);
   }

   if (digitsToKeepInIntegerPart != null) {
      numParts[0] = numParts[0].substring(
         0,
         number >= 0 ? digitsToKeepInIntegerPart : digitsToKeepInIntegerPart + 1
      );
   }

   numStr = numParts.join(".");

   let result = Number(numStr);

   if (Number.isNaN(result)) {
      result = 0;
   }

   return result;
}

export interface RemoveDigitsFromNumberOptions {
   /**
    * Digits to keep in the decimals part of the number
    */
   digitsToKeepInDecimalPart?: number;
   /**
    * Digits to keep in the integer part of the number not including negative symbol (-)
    */
   digitsToKeepInIntegerPart?: number;
}
