import { tryToGetErrorMessage } from "../../httpRequest";
import { showRequestErrorAlert } from "../../showRequestErrorAlert";
import { RequestError, UseCache } from "../useCache";

export function addDefaultErrorHandling<Response = void, Error = any>(
   queryResult: UseCache<Response, Error>
): UseCache<Response, Error> {
   if (!queryResult.error) {
      return queryResult;
   }

   const error = queryResult.error as any;
   const result: RequestError = {
      response: error.response,
      message: tryToGetErrorMessage(error)
   };

   if (error.response == null) {
      showRequestErrorAlert({
         errorMsg: I18n.t("There seems to be a connection problem"),
         retryFn: () => queryResult.revalidate()
      });
   } else {
      showRequestErrorAlert({ errorMsg: result.message });
   }

   return queryResult;
}
