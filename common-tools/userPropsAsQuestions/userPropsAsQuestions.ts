import i18n from "i18n-js";
import { Gender, User } from "../../api/server/shared-tools/endpoints-interfaces/user";

const genderQuestion: UserPropAsQuestion<Gender> = {
   propName: "gender",
   text: "¿Cual es tu género?",
   shortVersion: "Su género",
   answers: [
      {
         text: "Mujer",
         value: Gender.Woman
      },
      {
         text: "Varón",
         value: Gender.Man
      },
      {
         text: "Mujer transexual",
         value: Gender.TransgenderWoman
      },
      {
         text: "Varon transexual",
         value: Gender.TransgenderMan
      },
      {
         text: "Otrx / No binarix",
         value: Gender.Other
      }
   ]
};

const genderLikeQuestion: UserPropAsQuestion<boolean> = {
   text: "¿Qué géneros te atraen?",
   shortVersion: "Le atraen",
   multipleAnswersAllowed: true,
   answers: [
      {
         text: "Mujeres",
         propName: "likesWoman",
         value: true
      },
      {
         text: "Varones",
         propName: "likesMan",
         value: true
      },
      {
         text: "Mujeres transexuales",
         propName: "likesWomanTrans",
         value: true
      },
      {
         text: "Varones transexuales",
         propName: "likesManTrans",
         value: true
      },
      {
         text: "Otres / No binaries",
         propName: "likesOtherGenders",
         value: true
      }
   ]
};

const isCoupleProfileQuestion: UserPropAsQuestion<boolean> = {
   propName: "isCoupleProfile",
   text: i18n.t("If you go to a group date from this app, do you plan to go with someone?"),
   shortVersion: i18n.t("Would go on the date with"),
   answers: [
      {
         text: i18n.t("Just me"),
         value: false
      },
      {
         text: i18n.t("With my couple"),
         value: true
      }
   ]
};

export const propsAsQuestions: Array<UserPropAsQuestion<boolean | Gender>> = [
   genderQuestion,
   genderLikeQuestion,
   isCoupleProfileQuestion
];

export interface UserPropAsQuestion<T> {
   text: string;
   answers: Array<UserPropAsQuestionAnswer<T>>;
   propName?: keyof User;
   multipleAnswersAllowed?: boolean;
   shortVersion?: string;
}

export interface UserPropAsQuestionAnswer<T> {
   propName?: keyof User;
   text: string;
   shortVersion?: string;
   value: T;
}
