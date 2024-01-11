"use client";

import { CustomPasswordFieldWidget } from "@concepta/react-material-ui/dist/styles/CustomWidgets";

import AuthModule from "@/components/AuthModule";

const ResetPasswordModule = () => {
  return (
    <AuthModule
      route="resetPassword"
      formProps={{
        formSchema: {
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
        },
        formUiSchema: {
          newPassword: {
            "ui:widget": CustomPasswordFieldWidget,
          },
          confirmNewPassword: {
            "ui:widget": CustomPasswordFieldWidget,
          },
        },
      }}
      moduleProps={{
        signInPath: "/sign-in",
      }}
    />
  );
};

export default ResetPasswordModule;
