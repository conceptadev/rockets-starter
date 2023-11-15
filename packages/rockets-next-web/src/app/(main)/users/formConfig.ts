import type { RJSFSchema, UiSchema } from "@rjsf/utils";
import type { ActionType } from "./types";

import {
  CustomTextFieldWidget,
  CustomEmailFieldWidget,
  CustomSelectWidget,
} from "@concepta/react-material-ui/dist/styles/CustomWidgets";

export const widgets = {
  TextWidget: CustomTextFieldWidget,
  EmailWidget: CustomEmailFieldWidget,
  SelectWidget: CustomSelectWidget,
};

export const schema: RJSFSchema = {
  type: "object",
  required: ["email", "username"],
  properties: {
    email: { type: "string", title: "Email", minLength: 3, format: "email" },
    username: { type: "string", title: "Username", minLength: 3 },
  },
};

export const getUiSchemaByViewMode = (viewMode: ActionType): UiSchema => ({
  email: {
    "ui:widget": CustomEmailFieldWidget,
    "ui:disabled": viewMode === "details",
  },
  username: {
    "ui:widget": CustomTextFieldWidget,
    "ui:disabled": viewMode === "edit" || viewMode === "details",
  },
});
