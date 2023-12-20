import type { RJSFSchema, UiSchema } from "@rjsf/utils";
import { CustomTextFieldWidget } from "@concepta/react-material-ui/dist/styles/CustomWidgets";

import type { ActionType } from "@/types/User";

export const widgets = {
  TextWidget: CustomTextFieldWidget,
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
    "ui:widget": CustomTextFieldWidget,
    "ui:disabled": viewMode === "details",
  },
  username: {
    "ui:widget": CustomTextFieldWidget,
    "ui:disabled": viewMode === "edit" || viewMode === "details",
  },
});
