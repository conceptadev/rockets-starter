import type { RJSFSchema, UiSchema } from "@rjsf/utils";
import { AdvancedProperty } from "@concepta/react-material-ui/dist/components/SchemaForm/types";
import { CustomPasswordFieldWidget } from "@concepta/react-material-ui/dist/styles/CustomWidgets";

import { ValidationRule } from "@/utils/formValidation/formValidation";

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

export const uiSchema: UiSchema = {
  newPassword: {
    "ui:widget": CustomPasswordFieldWidget,
  },
  confirmNewPassword: {
    "ui:widget": CustomPasswordFieldWidget,
  },
};

export const validationRules: ValidationRule<FormData>[] = [
  {
    field: "confirmNewPassword",
    test: (value, formData) => value !== formData.newPassword,
    message: "Your passwords don't match. Please try again",
  },
];
