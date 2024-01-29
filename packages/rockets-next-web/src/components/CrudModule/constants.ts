import type { RJSFSchema, UiSchema } from "@rjsf/utils";

import { CustomTextFieldWidget } from "@concepta/react-material-ui/dist/styles/CustomWidgets";

export const defaultTableProps = {
  tableSchema: [
    {
      id: "id",
      label: "ID",
    },
    {
      id: "email",
      label: "Email",
    },
    {
      id: "username",
      label: "Username",
    },
  ],
  searchParam: "email",
  hideActionsColumn: false,
};

export const defaultFormProps: {
  formSchema: RJSFSchema;
  formUiSchema: UiSchema;
} = {
  formSchema: {
    type: "object",
    required: ["email", "username"],
    properties: {
      email: {
        type: "string",
        title: "Email",
        minLength: 3,
        format: "email",
      },
      username: { type: "string", title: "Username", minLength: 3 },
    },
  },
  formUiSchema: {
    email: {
      "ui:widget": CustomTextFieldWidget,
    },
    username: {
      "ui:widget": CustomTextFieldWidget,
    },
  },
};
