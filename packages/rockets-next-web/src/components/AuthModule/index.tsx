"use client";

import type { RJSFSchema, UiSchema } from "@rjsf/utils";

import SignInSubmodule from "../Submodules/SignIn";
import SignUpSubmodule from "../Submodules/SignUp";
import ForgotPasswordSubmodule from "../Submodules/ForgotPassword";
import ResetPasswordSubmodule from "../Submodules/ResetPassword";

type Route = "signIn" | "signUp" | "forgotPassword" | "resetPassword";

interface FormProps {
  formSchema: RJSFSchema;
  formUiSchema?: UiSchema;
}

interface ModuleProps {
  signInRequestPath?: string;
  forgotPasswordPath?: string;
  signUpPath?: string;
  signInPath?: string;
}

interface AuthModuleProps {
  route: Route;
  formProps: FormProps;
  moduleProps?: ModuleProps;
}

const AuthModule = (props: AuthModuleProps) => {
  return {
    signIn: <SignInSubmodule {...props.formProps} {...props.moduleProps} />,
    signUp: <SignUpSubmodule {...props.formProps} {...props.moduleProps} />,
    forgotPassword: (
      <ForgotPasswordSubmodule {...props.formProps} {...props.moduleProps} />
    ),
    resetPassword: (
      <ResetPasswordSubmodule {...props.formProps} {...props.moduleProps} />
    ),
  }[props.route];
};

export default AuthModule;
