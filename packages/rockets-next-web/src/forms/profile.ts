import type { RJSFSchema } from "@rjsf/utils";
import { CustomTextFieldWidget } from "@concepta/react-material-ui/dist/styles/CustomWidgets";
import { AdvancedProperty } from "@concepta/react-material-ui/dist/components/SchemaForm/types";

import { ValidationRule } from "@/utils/formValidation/formValidation";
import { PasswordChangeFormData } from "@/types/Profile";

export const widgets = {
  TextWidget: CustomTextFieldWidget,
};

export const profileFormSchema: RJSFSchema = {
  type: "object",
  required: ["firstName", "lastName"],
  properties: {
    email: { type: "string", title: "Email", minLength: 3, readOnly: true },
    firstName: { type: "string", title: "First name", minLength: 3 },
    lastName: { type: "string", title: "Last name", minLength: 3 },
  },
};

export const passwordChangeFormSchema: RJSFSchema = {
  type: "object",
  required: ["oldPassword", "newPassword", "confirmNewPassword"],
  properties: {
    oldPassword: { type: "string", title: "Old password" },
    newPassword: { type: "string", title: "New password" },
    confirmNewPassword: { type: "string", title: "Confirm new password" },
  },
};

export const advancedProperties: Record<string, AdvancedProperty> = {
  oldPassword: {
    type: "password",
  },
  newPassword: {
    type: "password",
  },
  confirmNewPassword: {
    type: "password",
  },
};

export const validationRules: ValidationRule<PasswordChangeFormData>[] = [
  {
    field: "oldPassword",
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
