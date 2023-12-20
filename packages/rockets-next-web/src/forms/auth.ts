import type { RJSFSchema, UiSchema } from "@rjsf/utils";
import {
  CustomTextFieldWidget,
  CustomEmailFieldWidget,
} from "@concepta/react-material-ui/dist/styles/CustomWidgets";
import { AdvancedProperty } from "@concepta/react-material-ui/dist/components/SchemaForm/types";
import { CustomPasswordFieldWidget } from "@concepta/react-material-ui/dist/styles/CustomWidgets";

import { ValidationRule } from "@/utils/formValidation/formValidation";

export const forgotPasswordFormSchema: RJSFSchema = {
  type: "object",
  required: ["email"],
  properties: {
    email: { type: "string", title: "Email", minLength: 3, format: "email" },
  },
};

export interface ResetPasswordFormData {
  newPassword: string;
  confirmNewPassword: string;
}

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

export const uiSchema: UiSchema = {
  newPassword: {
    "ui:widget": CustomPasswordFieldWidget,
  },
  confirmNewPassword: {
    "ui:widget": CustomPasswordFieldWidget,
  },
};

export const validationRules: ValidationRule<ResetPasswordFormData>[] = [
  {
    field: "confirmNewPassword",
    test: (value, formData) => value !== formData.newPassword,
    message: "Your passwords don't match. Please try again",
  },
];

export interface SignInFormData {
  username: string;
  password: string;
}

export interface SignUpFormData {
  email: string;
  username: string;
  password: string;
}

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
    email: { type: "string", title: "Email", minLength: 3, format: "email" },
    username: { type: "string", title: "Username", minLength: 3 },
    password: { type: "string", title: "Password" },
  },
};

export const advancedProperties: Record<string, AdvancedProperty> = {
  email: {
    type: "string",
  },
  username: {
    type: "string",
  },
  password: {
    type: "password",
  },
  newPassword: {
    type: "password",
  },
  confirmNewPassword: {
    type: "password",
  },
};

export const widgets = {
  TextWidget: CustomTextFieldWidget,
  EmailWidget: CustomEmailFieldWidget,
};
