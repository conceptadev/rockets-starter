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

const ResetPassword = () => {
  return (
    <AuthModule
      route="resetPassword"
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

export default ResetPassword;
