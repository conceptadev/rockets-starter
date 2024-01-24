"use client";

import { useState } from "react";
import type { IChangeEvent } from "@rjsf/core";
import { SchemaForm, Dialog } from "@concepta/react-material-ui";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import validator from "@rjsf/validator-ajv6";
import useTheme from "@mui/material/styles/useTheme";

import { type PasswordChangeFormData } from "@/types/Profile";
import {
  passwordChangeFormSchema,
  widgets,
  advancedProperties,
  validationRules,
} from "@/components/submodules/PasswordUpdate/constants";
import { validateForm } from "@/utils/formValidation/formValidation";

import ConfirmationModal from "@/components/PasswordChangeConfirmationModal";

const PasswordUpdateSubmodule = () => {
  const theme = useTheme();

  const [formData, setFormData] = useState<PasswordChangeFormData>({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const [isPasswordChangeModalOpen, setPasswordChangeModalOpen] =
    useState<boolean>(false);
  const [isConfirmationModalOpen, setConfirmationModalOpen] =
    useState<boolean>(false);

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

  const handleFormSubmit = async (_: IChangeEvent<PasswordChangeFormData>) => {
    closePasswordChangeModal();
    openConfirmationModal();
  };

  return (
    <Box>
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
        <SchemaForm.Form
          schema={passwordChangeFormSchema}
          advancedProperties={advancedProperties}
          validator={validator}
          onSubmit={handleFormSubmit}
          widgets={widgets}
          noHtml5Validate={true}
          showErrorList={false}
          formData={formData}
          onChange={({ formData }) => {
            setFormData(formData);
          }}
          customValidate={(formData, errors) =>
            validateForm(formData, errors, validationRules)
          }
        >
          <Box
            display="flex"
            flexDirection="row"
            alignItems="center"
            justifyContent="space-between"
            mt={4}
          >
            <Button type="submit" variant="contained" sx={{ flex: 1, mr: 1 }}>
              Save
            </Button>
          </Box>
        </SchemaForm.Form>
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

export default PasswordUpdateSubmodule;
