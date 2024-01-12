"use client";

import { CustomTextFieldWidget } from "@concepta/react-material-ui/dist/styles/CustomWidgets";

import AuthModule from "@/components/AuthModule";

const ForgotPasswordModule = () => {
  return (
    <AuthModule
      route="forgotPassword"
      formProps={{
        formSchema: {
          type: "object",
          required: ["email"],
          properties: {
            email: {
              type: "string",
              title: "Email",
              minLength: 3,
              format: "email",
            },
          },
          formUiSchema: {
            email: {
              "ui:widget": CustomTextFieldWidget,
            },
          },
        },
      }}
      moduleProps={{
        signInPath: "/sign-in",
        queryMethod: "post",
        queryUri: "/auth/recovery/password",
      }}
    />
  );
};

export default ForgotPasswordModule;
