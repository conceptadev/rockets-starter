"use client";

import { AuthModule } from "@concepta/react-material-ui";

const SignUp = () => {
  return <AuthModule route="signUp" moduleProps={{ signInPath: "/login" }} />;
};

export default SignUp;
