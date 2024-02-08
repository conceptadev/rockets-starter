"use client";

import { AuthModule } from "@concepta/react-material-ui";

const ResetPassword = () => {
  return (
    <AuthModule route="resetPassword" moduleProps={{ signInPath: "/login" }} />
  );
};

export default ResetPassword;
