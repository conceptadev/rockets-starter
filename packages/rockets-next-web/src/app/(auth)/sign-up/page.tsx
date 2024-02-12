"use client";

import { AuthModule } from "@concepta/react-material-ui";
import { toast } from "react-toastify";

interface NetworkError {
  response: {
    data: {
      message: string;
    };
  };
}

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
