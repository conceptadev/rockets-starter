"use client";

import React, { FC, useState } from "react";
import { Dialog, TextField, Text } from "@concepta/react-material-ui";
import { useAuth } from "@concepta/react-auth-provider";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import useTheme from "@mui/material/styles/useTheme";

import ChangePasswordForm from "./ChangePasswordForm";
import ConfirmationModal from "./ConfirmationModal";
import { UserData } from "./types";

const ProfileScreen: FC = () => {
  const theme = useTheme();
  const { user } = useAuth();

  const [isPasswordChangeModalOpen, setPasswordChangeModalOpen] =
    useState<boolean>(false);
  const [isConfirmationModalOpen, setConfirmationModalOpen] =
    useState<boolean>(false);
  const [formData, setFormData] = useState({
    firstName: "John",
    lastName: "Smith",
  });

  const openPasswordChangeModal = () => {
    setPasswordChangeModalOpen(true);
  };

  const closePasswordChangeModal = () => {
    setPasswordChangeModalOpen(false);
  };

  const openConfirmationModal = () => {
    setConfirmationModalOpen(true);
  };

  const closeConfirmationModal = () => {
    setConfirmationModalOpen(false);
  };

  const handleFormChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [evt.target.name]: evt.target.value,
    });
  };

  const handleFormSubmit = () => {};

  return (
    <>
      <Box sx={{ mb: 3 }}>
        <Text fontFamily="Inter" fontSize={20} fontWeight={800} mt={4}>
          Profile
        </Text>
        <Text fontWeight="400" fontSize={14}>
          Update your profile
        </Text>
      </Box>

      <Box mb={3} sx={{ maxWidth: "406px" }}>
        <TextField label="Email" value={(user as UserData)?.email} disabled />
      </Box>

      <Button
        variant="outlined"
        sx={{
          color: theme.palette.text.primary,
          borderColor: theme.palette.text.primary,
          mb: 4,
        }}
        onClick={openPasswordChangeModal}
      >
        Update Password
      </Button>

      <Box display="flex" mb={3}>
        <Box sx={{ mr: 2 }}>
          <TextField
            name="firstName"
            label="First name"
            value={formData.firstName}
            onChange={handleFormChange}
          />
        </Box>
        <Box>
          <TextField
            name="lastName"
            label="Last name"
            value={formData.lastName}
            onChange={handleFormChange}
          />
        </Box>
      </Box>

      <Button variant="contained" onClick={handleFormSubmit}>
        Save
      </Button>

      <Dialog
        open={isPasswordChangeModalOpen}
        handleClose={closePasswordChangeModal}
        title="Change password"
      >
        <ChangePasswordForm
          closePasswordChangeModal={closePasswordChangeModal}
          openConfirmationModal={openConfirmationModal}
        />
      </Dialog>

      <Dialog
        open={isConfirmationModalOpen}
        handleClose={closeConfirmationModal}
      >
        <ConfirmationModal handleClose={closeConfirmationModal} />
      </Dialog>
    </>
  );
};

export default ProfileScreen;
