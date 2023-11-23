import type { RJSFSchema, UiSchema } from "@rjsf/utils";
import {
  CustomTextFieldWidget,
  CustomEmailFieldWidget,
} from "@concepta/react-material-ui/dist/styles/CustomWidgets";

export const schema: RJSFSchema = {
  type: "object",
  required: ["email"],
  properties: {
    email: { type: "string", title: "Email", minLength: 3, format: "email" },
  },
};

export const widgets = {
  TextWidget: CustomTextFieldWidget,
  EmailWidget: CustomEmailFieldWidget,
};

export const uiSchema: UiSchema = {
  email: {
    "ui:widget": CustomEmailFieldWidget,
  },
};
