"use client";

import { UsersModule } from "@concepta/react-material-ui";
import { toast } from "react-toastify";

const PageUsers = () => {
  return (
    <UsersModule
      onEditError={() => {
        toast.error(
          "We encountered an error while updating the user. Please try again later."
        );
      }}
      onEditSuccess={() => {
        toast.success("User successfully updated.");
      }}
    />
  );
};

export default PageUsers;
