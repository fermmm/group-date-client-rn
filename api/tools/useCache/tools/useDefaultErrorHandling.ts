import { useEffect, useRef } from "react";
import { tryToGetErrorMessage } from "../../httpRequest";
import { showRequestErrorAlert } from "../../showRequestErrorAlert";
import { RequestError, UseCache } from "../useCache";

export function useDefaultErrorHandling<Response = void, Error = any>(
   queryResult: UseCache<Response, Error>,
   config?: { showAlertOnError?: boolean }
): UseCache<Response, Error> {
   const { showAlertOnError = true } = config || {};
   const stopShowing = useRef(false);

   useEffect(() => {
      stopShowing.current = false;
   }, [queryResult.error]);

   if (
      stopShowing.current ||
      !queryResult.error ||
      queryResult.isLoading ||
      queryResult.isValidating
   ) {
      return queryResult;
   }

   const error = queryResult.error as any;
   const result: RequestError = {
      response: error.response,
      message: tryToGetErrorMessage(error)
   };

   stopShowing.current = true;

   if (!showAlertOnError) {
      return queryResult;
   }

   if (error.response == null) {
      showRequestErrorAlert({
         retryFn: () => {
            queryResult.revalidate();
            stopShowing.current = false;
         }
      });
   } else {
      showRequestErrorAlert({
         errorMsg: result.message
      });
   }

   return queryResult;
}
