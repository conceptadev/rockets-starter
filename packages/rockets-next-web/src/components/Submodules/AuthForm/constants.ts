import type { RJSFSchema, UiSchema } from "@rjsf/utils";

import {
  CustomTextFieldWidget,
  CustomPasswordFieldWidget,
} from "@concepta/react-material-ui/dist/styles/CustomWidgets";

export const defaultAuthUiSchema: UiSchema = {
  email: {
    "ui:widget": CustomTextFieldWidget,
  },
  username: {
    "ui:widget": CustomTextFieldWidget,
  },
  password: {
    "ui:widget": CustomPasswordFieldWidget,
  },
  newPassword: {
    "ui:widget": CustomPasswordFieldWidget,
  },
  confirmNewPassword: {
    "ui:widget": CustomPasswordFieldWidget,
  },
};

export const signInFormSchema: RJSFSchema = {
  type: "object",
  required: ["username", "password"],
  properties: {
    username: { type: "string", title: "Username", minLength: 3 },
    password: { type: "string", title: "Password" },
  },
};

export const signUpFormSchema: RJSFSchema = {
  type: "object",
  required: ["email", "username", "password"],
  properties: {
    email: {
      type: "string",
      title: "Email",
      minLength: 3,
      format: "email",
    },
    username: { type: "string", title: "Username", minLength: 3 },
    password: { type: "string", title: "Password" },
  },
};

export const forgotPasswordFormSchema: RJSFSchema = {
  type: "object",
  required: ["email"],
  properties: {
    email: {
      type: "string",
      title: "Email",
      minLength: 3,
      format: "email",
    },
  },
};

export const resetPasswordFormSchema: RJSFSchema = {
  type: "object",
  required: ["newPassword", "confirmNewPassword"],
  properties: {
    newPassword: {
      type: "string",
      title: "New password",
    },
    confirmNewPassword: {
      type: "string",
      title: "Re-enter your new password",
    },
  },
};

export const signInModuleProps = {
  signInRequestPath: "/auth/login",
  forgotPasswordPath: "/forgot-password",
  signUpPath: "/sign-up",
  queryMethod: "",
  queryUri: "",
};

export const signUpModuleProps = {
  signInPath: "/sign-in",
  queryMethod: "post",
  queryUri: "/user",
};

export const forgotPasswordModuleProps = {
  signInPath: "/sign-in",
  queryMethod: "post",
  queryUri: "/auth/recovery/password",
};

export const resetPasswordModuleProps = {
  signInPath: "/sign-in",
  queryMethod: "patch",
  queryUri: "/auth/recovery/password",
};
