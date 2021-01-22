import { Gender } from "../../api/server/shared-tools/endpoints-interfaces/user";

export function getGenderName(gender: Gender, isCoupleProfile: boolean): string {
   if (isCoupleProfile) {
      return "Pareja";
   }

   switch (gender) {
      case Gender.Man:
         return "Hombre";
         break;
      case Gender.Woman:
         return "Mujer";
         break;
      case Gender.TransgenderMan:
         return "Hombre trans";
         break;
      case Gender.TransgenderWoman:
         return "Mujer trans";
         break;
      case Gender.Other:
         return "Otrx / No binarix";
         break;
   }
}
