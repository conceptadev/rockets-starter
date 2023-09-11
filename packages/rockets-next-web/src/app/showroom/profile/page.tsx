"use client";

import React, { FC, useState } from "react";
import { Dialog, TextField, Text } from "@concepta/react-material-ui";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import useTheme from "@mui/material/styles/useTheme";
import ChangePasswordForm from "./ChangePasswordForm";
import ConfirmationModal from "./ConfirmationModal";

const Profile: FC = () => {
  const theme = useTheme();

  const lightMode = theme.palette.mode === "light";

  const [addMemberModalOpen, setAddMemberModalOpen] = useState<boolean>(false);
  const [confirmationModalOpen, setConfirmationModalOpen] =
    useState<boolean>(false);

  const [form, setForm] = useState({ firstName: "John", lastName: "Smith" });

  const openMemberModal = () => {
    setAddMemberModalOpen(true);
  };

  const closeMemberModal = () => {
    setAddMemberModalOpen(false);
  };

  const openConfirmationModal = () => {
    setConfirmationModalOpen(true);
  };

  const closeConfirmationModal = () => {
    setConfirmationModalOpen(false);
  };

  const handleFormChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [evt.target.name]: evt.target.value,
    });
  };

  const sendForm = () => {
    console.log("form:", form);
  };

  return (
    <>
      <Box sx={{ mb: 3 }}>
        <Text
          fontWeight="500"
          fontSize={24}
          sx={{ color: lightMode ? "#111827" : "#dce2ee" }}
        >
          Profile
        </Text>
        <Text
          fontWeight="400"
          fontSize={14}
          sx={{ color: lightMode ? "#6B7280" : "#9098a7" }}
        >
          Update your profile
        </Text>
      </Box>

      <Box>
        <TextField label="Email" value="johnsmith@example.com" disabled />
      </Box>

      <Button
        variant="outlined"
        sx={{
          color: theme.palette.text.primary,
          borderColor: theme.palette.text.primary,
          mb: 4,
        }}
        onClick={openMemberModal}
      >
        Update Password
      </Button>

      <Box display="flex">
        <Box sx={{ mr: 2 }}>
          <TextField
            name="firstName"
            label="First name"
            value={form.firstName}
            onChange={handleFormChange}
          />
        </Box>
        <Box>
          <TextField
            name="lastName"
            label="Last name"
            value={form.lastName}
            onChange={handleFormChange}
          />
        </Box>
      </Box>

      <Button variant="contained" onClick={sendForm}>
        Save
      </Button>

      <Dialog
        open={addMemberModalOpen}
        handleClose={closeMemberModal}
        title="Change password"
      >
        <ChangePasswordForm
          closeMemberModal={closeMemberModal}
          openConfirmationModal={openConfirmationModal}
        />
      </Dialog>

      <Dialog open={confirmationModalOpen} handleClose={closeConfirmationModal}>
        <ConfirmationModal handleClose={closeConfirmationModal} />
      </Dialog>
    </>
  );
};

export default Profile;
