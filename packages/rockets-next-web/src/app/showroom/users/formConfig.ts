import type { RJSFSchema, UiSchema, FormValidation } from "@rjsf/utils";
import type { AdvancedProperty } from "@concepta/react-material-ui/dist/components/SchemaForm/types";

import {
  CustomTextFieldWidget,
  CustomEmailFieldWidget,
  CustomSelectWidget,
} from "@concepta/react-material-ui/dist/styles/CustomWidgets";
import emailValidation from "@/utils/emailValidation/emailValidation";

export type FormData = {
  id?: string;
  name: string;
  email: string;
  status: string;
  role: string;
  lastLogin: string;
};

export const widgets = {
  TextWidget: CustomTextFieldWidget,
  EmailWidget: CustomEmailFieldWidget,
  SelectWidget: CustomSelectWidget,
};

export const schema: RJSFSchema = {
  type: "object",
  required: ["name", "email", "status", "role"],
  properties: {
    name: { type: "string", title: "Name", minLength: 3 },
    email: { type: "string", title: "Email", minLength: 3 },
    status: {
      type: "string",
      title: "Status",
      oneOf: [
        { const: "schedule", title: "Schedule" },
        { const: "available", title: "Available" },
        { const: "unavailable", title: "Unavailable" },
      ],
    },
    role: {
      type: "string",
      title: "Role",
      oneOf: [
        { const: "teacher", title: "Teacher" },
        { const: "director", title: "Director" },
        { const: "counselor", title: "Counselor" },
      ],
    },
  },
};

export const advancedProperties: Record<string, AdvancedProperty> = {
  status: {
    type: "select",
  },
  role: {
    type: "select",
  },
};

export const uiSchema: UiSchema = {
  name: { "ui:widget": CustomTextFieldWidget },
  email: { "ui:widget": CustomEmailFieldWidget },
  status: { "ui:widget": CustomSelectWidget },
  role: { "ui:widget": CustomSelectWidget },
};

export const validate = (formData: FormData, errors: FormValidation) => {
  if (!emailValidation(formData.email)) {
    errors?.email?.addError("please enter a valid email");
  }

  return errors;
};
