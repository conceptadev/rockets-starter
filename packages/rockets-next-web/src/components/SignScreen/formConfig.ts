import type { RJSFSchema } from "@rjsf/utils";
import { CustomTextFieldWidget } from "@concepta/react-material-ui/dist/styles/CustomWidgets";
import { AdvancedProperty } from "@concepta/react-material-ui/dist/components/SchemaForm/types";

export const schema: RJSFSchema = {
  type: "object",
  required: ["username", "password"],
  properties: {
    username: { type: "string", title: "Username", minLength: 3 },
    password: { type: "string", title: "Password" },
  },
};

export const advancedProperties: Record<string, AdvancedProperty> = {
  username: {
    type: "string",
  },
  password: {
    type: "password",
  },
};

export const widgets = {
  TextWidget: CustomTextFieldWidget,
};
