"use client";

import { AuthModule } from "@concepta/react-material-ui";
import { toast } from "react-toastify";

import { NetworkError } from "@/types/Network";

const SignUp = () => {
  return (
    <AuthModule
      route="signUp"
      moduleProps={{
        signInPath: "/login",
        onSuccess: () => toast.success("Success!"),
        onError: (error) =>
          toast.error(
            (error as NetworkError)?.response?.data?.message ||
              "An error has occurred. Please try again later or contact support for assistance."
          ),
      }}
    />
  );
};

export default SignUp;
