"use client";

import type { RJSFSchema, UiSchema } from "@rjsf/utils";
import type { ValidationRule } from "@/utils/formValidation/formValidation";

import AuthFormSubmodule from "@/components/Submodules/AuthForm";

import {
  signInModuleProps,
  signUpModuleProps,
  forgotPasswordModuleProps,
  resetPasswordModuleProps,
} from "./constants";

type Route = "signIn" | "signUp" | "forgotPassword" | "resetPassword";

interface FormProps {
  formSchema?: RJSFSchema;
  formUiSchema?: UiSchema;
  customValidation?: ValidationRule<Record<string, string>>[];
}

interface ModuleProps {
  title?: string;
  signInRequestPath?: string;
  forgotPasswordPath?: string;
  signUpPath?: string;
  signInPath?: string;
  queryUri?: string;
  queryMethod?: string;
  submitButtonTitle?: string;
  logoSrc?: string;
}

interface AuthModuleProps {
  route: Route;
  formProps?: FormProps;
  moduleProps?: ModuleProps;
}

const AuthModule = (props: AuthModuleProps) => {
  const defaultModuleProps = {
    signIn: signInModuleProps,
    signUp: signUpModuleProps,
    forgotPassword: forgotPasswordModuleProps,
    resetPassword: resetPasswordModuleProps,
  }[props.route];

  return (
    <AuthFormSubmodule
      route={props.route}
      {...props.formProps}
      {...props.moduleProps}
      {...defaultModuleProps}
    />
  );
};

export default AuthModule;
