import { Validation } from "simple-validator-js";

export const formValidators: FormValidators = {
   name: t => new Validation(t).noInvalidSpacesAllowed(true).maxChars(35, true),
   age: t =>
      new Validation(t)
         .noLettersAllowed(true)
         .maxChars(3, true)
         .noSpecialCharactersAllowed(false, [], true),
   bodyHeight: t =>
      new Validation(t)
         .noLettersAllowed(true)
         .maxChars(3, true)
         .noSpecialCharactersAllowed(false, [], true)
};

export interface FormValidators {
   name: (t: string) => Validation;
   age: (t: string) => Validation;
   bodyHeight: (t: string) => Validation;
}
