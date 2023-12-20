"use client";

import { useState, useEffect } from "react";
import type { IChangeEvent } from "@rjsf/core";
import { Dialog, Text } from "@concepta/react-material-ui";
import { useAuth } from "@concepta/react-auth-provider";
import { SchemaForm } from "@concepta/react-material-ui";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import useTheme from "@mui/material/styles/useTheme";
import { toast } from "react-toastify";
import validator from "@rjsf/validator-ajv6";

import ChangePasswordForm from "./ChangePasswordForm";
import ConfirmationModal from "./ConfirmationModal";

import { profileFormSchema, widgets } from "@/forms/profile";

import type { ProfileFormData } from "@/types/Profile";
import type { User } from "@/types/User";

const ProfileScreen = () => {
  const theme = useTheme();

  const { user } = useAuth();

  const [isPasswordChangeModalOpen, setPasswordChangeModalOpen] =
    useState<boolean>(false);
  const [isConfirmationModalOpen, setConfirmationModalOpen] =
    useState<boolean>(false);
  const [formData, setFormData] = useState({
    email: "",
    firstName: "John",
    lastName: "Smith",
  });
  const [isLoadingSubmit, setLoadingSubmit] = useState(false);

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

  const handleFormSubmit = async (_: IChangeEvent<ProfileFormData>) => {
    setLoadingSubmit(true);

    setTimeout(() => {
      setLoadingSubmit(false);
      toast.success("Profile successfully updated");
    }, 2000);
  };

  useEffect(() => {
    if (user && !formData.email) {
      setFormData({ ...formData, email: (user as User).email });
    }
  }, [user, formData]);

  return (
    <Box>
      <Box sx={{ mb: 2 }}>
        <Text fontFamily="Inter" fontSize={20} fontWeight={800} mt={4}>
          Profile
        </Text>
        <Text fontWeight="400" fontSize={14}>
          Update your profile
        </Text>
      </Box>

      <Box display="flex" mb={4}>
        <SchemaForm.Form
          schema={profileFormSchema}
          validator={validator}
          onSubmit={handleFormSubmit}
          widgets={widgets}
          noHtml5Validate={true}
          showErrorList={false}
          formData={formData}
          onChange={({ formData }) => {
            setFormData(formData);
          }}
        >
          <Box
            display="flex"
            flexDirection="row"
            alignItems="center"
            justifyContent="space-between"
            mt={3}
          >
            <Button
              type="submit"
              variant="contained"
              disabled={isLoadingSubmit}
            >
              {isLoadingSubmit ? (
                <CircularProgress sx={{ color: "white" }} size={24} />
              ) : (
                "Save"
              )}
            </Button>
          </Box>
        </SchemaForm.Form>
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
    </Box>
  );
};

export default ProfileScreen;
