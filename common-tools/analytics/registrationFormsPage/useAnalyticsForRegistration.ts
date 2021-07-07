import { useEffect } from "react";
import { User } from "../../../api/server/shared-tools/endpoints-interfaces/user";
import { analyticsLogEvent } from "../tools/analyticsLog";

export function useAnalyticsForRegistration(
   user: Partial<User>,
   formsRequired: string[],
   currentStep: number
) {
   useEffect(() => {
      if (
         formsRequired == null ||
         currentStep == null ||
         user == null ||
         formsRequired[currentStep] == null
      ) {
         return;
      }

      if (!user.profileCompleted) {
         analyticsLogEvent(`registration_step_displayed___${formsRequired[currentStep]}`);
      } else {
         analyticsLogEvent(`user_modifies_profile_form___${formsRequired[currentStep]}`);
      }
   }, [currentStep, formsRequired]);
}
