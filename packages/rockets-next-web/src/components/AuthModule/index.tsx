"use client";

import type { RJSFSchema, UiSchema } from "@rjsf/utils";

import SignInSubmodule from "../Submodules/SignIn";
import SignUpSubmodule from "../Submodules/SignUp";
import ForgotPasswordSubmodule from "../Submodules/ForgotPassword";
import ResetPasswordSubmodule from "../Submodules/ResetPassword";

type Route = "signIn" | "signUp" | "forgotPassword" | "resetPassword";

interface ModuleProps {
  route: Route;
  formSchema: RJSFSchema;
  formUiSchema?: UiSchema;
}

const AuthModule = (props: ModuleProps) => {
  return {
    signIn: (
      <SignInSubmodule
        formSchema={props.formSchema}
        formUiSchema={props.formUiSchema}
        forgotPasswordPath="/forgot-password"
        signUpPath="/sign-up"
      />
    ),
    signUp: (
      <SignUpSubmodule
        formSchema={props.formSchema}
        formUiSchema={props.formUiSchema}
        signInPath="/sign-in"
      />
    ),
    forgotPassword: (
      <ForgotPasswordSubmodule
        formSchema={props.formSchema}
        formUiSchema={props.formUiSchema}
      />
    ),
    resetPassword: (
      <ResetPasswordSubmodule
        formSchema={props.formSchema}
        formUiSchema={props.formUiSchema}
      />
    ),
  }[props.route];
};

export default AuthModule;
