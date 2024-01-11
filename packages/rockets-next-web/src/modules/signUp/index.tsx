"use client";

import {
  CustomTextFieldWidget,
  CustomPasswordFieldWidget,
} from "@concepta/react-material-ui/dist/styles/CustomWidgets";

import AuthModule from "@/components/AuthModule";

const SignUpModule = () => {
  return (
    <AuthModule
      route="signUp"
      formSchema={{
        type: "object",
        required: ["email", "username", "password"],
        properties: {
          email: {
            type: "string",
            title: "Email",
            minLength: 3,
            format: "email",
          },
          username: { type: "string", title: "Username", minLength: 3 },
          password: { type: "string", title: "Password" },
        },
      }}
      formUiSchema={{
        email: {
          "ui:widget": CustomTextFieldWidget,
        },
        username: {
          "ui:widget": CustomTextFieldWidget,
        },
        password: {
          "ui:widget": CustomPasswordFieldWidget,
        },
      }}
    />
  );
};

export default SignUpModule;
