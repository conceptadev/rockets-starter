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
