"use client";

import {
  CustomTextFieldWidget,
  CustomPasswordFieldWidget,
} from "@concepta/react-material-ui/dist/styles/CustomWidgets";

import AuthModule from "@/components/AuthModule";

const SignInModule = () => {
  return (
    <AuthModule
      route="signIn"
      formProps={{
        formSchema: {
          type: "object",
          required: ["username", "password"],
          properties: {
            username: { type: "string", title: "Username", minLength: 3 },
            password: { type: "string", title: "Password" },
          },
        },
        formUiSchema: {
          username: {
            "ui:widget": CustomTextFieldWidget,
          },
          password: {
            "ui:widget": CustomPasswordFieldWidget,
          },
        },
      }}
      moduleProps={{
        signInRequestPath: "/auth/login",
        forgotPasswordPath: "/forgot-password",
        signUpPath: "/sign-up",
      }}
    />
  );
};

export default SignInModule;
