import type { RJSFSchema } from "@rjsf/utils";
import {
  CustomTextFieldWidget,
  CustomEmailFieldWidget,
} from "@concepta/react-material-ui/dist/styles/CustomWidgets";
import { AdvancedProperty } from "@concepta/react-material-ui/dist/components/SchemaForm/types";

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
};

export const widgets = {
  TextWidget: CustomTextFieldWidget,
  EmailWidget: CustomEmailFieldWidget,
};
