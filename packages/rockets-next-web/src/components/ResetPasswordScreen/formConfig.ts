import { AdvancedProperty } from "@concepta/react-material-ui/dist/components/SchemaForm/types";
import type { RJSFSchema, UiSchema } from "@rjsf/utils";
import { CustomTextFieldWidget } from "@concepta/react-material-ui/dist/styles/CustomWidgets";

export type ValidationRule<T> = {
  field: keyof T;
  test: (value: T[keyof T] | undefined | null, formData: T) => boolean;
  message: string;
};

export interface FormData {
  newPassword: string;
  confirmNewPassword: string;
}

export const schema: RJSFSchema = {
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

export const advancedProperties: Record<string, AdvancedProperty> = {
  newPassword: {
    type: "password",
  },
  confirmNewPassword: {
    type: "password",
  },
};

export const widgets = {
  TextField: CustomTextFieldWidget,
};

export const uiSchema: UiSchema = {
  newPassword: {
    "ui:widget": CustomTextFieldWidget,
  },
  confirmNewPassword: {
    "ui:widget": CustomTextFieldWidget,
  },
};

export const validationRules: ValidationRule<FormData>[] = [
  {
    field: "newPassword",
    test: (value) => !value,
    message: "Password is required",
  },
  {
    field: "confirmNewPassword",
    test: (value) => !value,
    message: "Password confirmation is required",
  },
  {
    field: "confirmNewPassword",
    test: (value, formData) => value !== formData.newPassword,
    message: "Your passwords don't match. Please try again",
  },
];
