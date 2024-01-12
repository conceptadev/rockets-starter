"use client";

import type { RJSFSchema, UiSchema } from "@rjsf/utils";
import type { ValidationRule } from "@/utils/formValidation/formValidation";

import AuthFormSubmodule from "../Submodules/AuthForm";

type Route = "signIn" | "signUp" | "forgotPassword" | "resetPassword";

interface FormProps {
  formSchema: RJSFSchema;
  formUiSchema?: UiSchema;
  customValidation?: ValidationRule<Record<string, string>>[];
}

interface ModuleProps {
  signInRequestPath?: string;
  forgotPasswordPath?: string;
  signUpPath?: string;
  signInPath?: string;
  queryUri: string;
  queryMethod: string;
}

interface AuthModuleProps {
  route: Route;
  formProps: FormProps;
  moduleProps: ModuleProps;
}

const AuthModule = (props: AuthModuleProps) => {
  const routeTitle = {
    signIn: "Sign in",
    signUp: "Sign up",
    forgotPassword: "Recover password",
    resetPassword: "Reset password",
  }[props.route];

  return (
    <AuthFormSubmodule
      route={props.route}
      title={routeTitle}
      {...props.formProps}
      {...props.moduleProps}
    />
  );
};

export default AuthModule;
