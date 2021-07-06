import { analyticsLogEvent } from "../tools/analyticsLog";

export function logAnalyticsLoginStep(loginStep: LoginStep) {
   analyticsLogEvent(loginStep);
}

export enum LoginStep {
   ClickedLoginButtonFb = "login_step_login_button_clicked_fb",
   ClickedLoginButtonGl = "login_step_login_button_clicked_gl",
   AcceptedGpsPermissions = "login_step_accepted_gps_permissions",
   LoginCompleted = "login_step_login_completed"
}
