import type { RJSFSchema, UiSchema } from "@rjsf/utils";

import {
  CustomTextFieldWidget,
  CustomPasswordFieldWidget,
} from "@concepta/react-material-ui/dist/styles/CustomWidgets";

import { ValidationRule } from "@/utils/formValidation/formValidation";

export const defaultProfileUiSchema: UiSchema = {
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

export const profileFormSchema: RJSFSchema = {
  type: "object",
  required: ["email", "firstName", "lastName"],
  properties: {
    email: { type: "string", title: "Username", format: "email" },
    firstName: { type: "string", title: "First name" },
    lastName: { type: "string", title: "Last name" },
  },
};

export const validationRules: ValidationRule<Record<string, string>>[] = [
  {
    field: "currentPassword",
    test: (value) => !value,
    message: "Required field",
  },
  {
    field: "newPassword",
    test: (value) => !value,
    message: "Required field",
  },
  {
    field: "confirmNewPassword",
    test: (value) => !value,
    message: "Required field",
  },
  {
    field: "confirmNewPassword",
    test: (value, formData) => value !== formData.newPassword,
    message: "Your passwords don't match. Please try again",
  },
];
