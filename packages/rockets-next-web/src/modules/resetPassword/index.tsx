"use client";

import AuthModule from "@/components/AuthModule";

const ResetPasswordModule = () => {
  return (
    <AuthModule
      route="resetPassword"
      formProps={{
        customValidation: [
          {
            field: "confirmNewPassword",
            test: (value, formData) => value !== formData.newPassword,
            message: "Your passwords don't match. Please try again",
          },
        ],
      }}
    />
  );
};

export default ResetPasswordModule;
