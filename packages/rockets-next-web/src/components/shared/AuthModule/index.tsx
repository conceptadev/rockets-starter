import type { RJSFSchema, UiSchema } from "@rjsf/utils";

import SignScreen from "@/components/auth/SignScreen";
import ForgotPasswordScreen from "@/components/auth/ForgotPasswordScreen";
import ResetPasswordScreen from "@/components/auth/ResetPasswordScreen";

type Route = "signIn" | "signUp" | "forgotPassword" | "resetPassword";

interface ModuleProps {
  route: Route;
  formSchema?: RJSFSchema;
  formUiSchema?: UiSchema;
}

const AuthModule = (props: ModuleProps) => {
  return {
    signIn: <SignScreen />,
    signUp: <SignScreen isSignUp />,
    forgotPassword: <ForgotPasswordScreen />,
    resetPassword: <ResetPasswordScreen />,
  }[props.route];
};

export default AuthModule;
