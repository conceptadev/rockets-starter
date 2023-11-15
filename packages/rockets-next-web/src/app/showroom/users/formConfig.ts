import type { RJSFSchema, UiSchema, FormValidation } from "@rjsf/utils";
import type { FormData } from "./types";

import {
  CustomTextFieldWidget,
  CustomEmailFieldWidget,
  CustomSelectWidget,
} from "@concepta/react-material-ui/dist/styles/CustomWidgets";
import emailValidation from "@/utils/emailValidation/emailValidation";

export const widgets = {
  TextWidget: CustomTextFieldWidget,
  EmailWidget: CustomEmailFieldWidget,
  SelectWidget: CustomSelectWidget,
};

export const schema: RJSFSchema = {
  type: "object",
  required: ["email", "username"],
  properties: {
    email: { type: "string", title: "Email", minLength: 3 },
    username: { type: "string", title: "Username", minLength: 3 },
  },
};

export const uiSchema: UiSchema = {
  email: { "ui:widget": CustomEmailFieldWidget },
  username: { "ui:widget": CustomTextFieldWidget },
};

export const validate = (formData: FormData, errors: FormValidation) => {
  if (!emailValidation(formData.email)) {
    errors?.email?.addError("please enter a valid email");
  }

  return errors;
};
