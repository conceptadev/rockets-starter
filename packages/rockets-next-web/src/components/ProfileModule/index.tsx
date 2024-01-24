"use client";

import Box from "@mui/material/Box";

import ProfileFormSubmodule from "@/components/submodules/ProfileForm";
import PasswordUpdateSubmodule from "../submodules/PasswordUpdate";

const ProfileModule = () => {
  return (
    <Box>
      <ProfileFormSubmodule />

      <PasswordUpdateSubmodule />
    </Box>
  );
};

export default ProfileModule;
