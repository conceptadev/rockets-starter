"use client";

import { AuthModule } from "@concepta/react-material-ui";

const ForgotPassword = () => {
  return (
    <AuthModule route="forgotPassword" moduleProps={{ signInPath: "/login" }} />
  );
};

export default ForgotPassword;
