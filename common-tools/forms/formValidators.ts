import { Validation } from "simple-validator-js";

export const formValidators: FormValidators = {
   name: t => new Validation(t).noInvalidSpacesAllowed(true).maxChars(35, true),
   email: t => new Validation(t).isEmail(),
   birthYear: t =>
      new Validation(t)
         .noLettersAllowed(true)
         .maxChars(4, true)
         .noSpecialCharactersAllowed(false, [], true),
   bodyHeight: t =>
      new Validation(t)
         .noLettersAllowed(true)
         .maxChars(3, true)
         .noSpecialCharactersAllowed(false, [], true),
   tagName: t =>
      new Validation(t)
         .noInvalidSpacesAllowed(true)
         .noNumbersAllowed(true)
         .noSpecialCharactersAllowed(),
   tagCategory: t =>
      new Validation(t)
         .noInvalidSpacesAllowed(true)
         .noNumbersAllowed(true)
         .noSpecialCharactersAllowed()
};

export interface FormValidators {
   name: (t: string) => Validation;
   email: (t: string) => Validation;
   birthYear: (t: string) => Validation;
   bodyHeight: (t: string) => Validation;
   tagName: (t: string) => Validation;
   tagCategory: (t: string) => Validation;
}
