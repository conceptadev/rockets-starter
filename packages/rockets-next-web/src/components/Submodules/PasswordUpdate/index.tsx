"use client";

import type { RJSFSchema, UiSchema } from "@rjsf/utils";
import type { IChangeEvent } from "@rjsf/core";
import type { AdvancedProperty } from "@concepta/react-material-ui/dist/components/SchemaForm/types";
import type { ValidationRule } from "@/utils/formValidation/formValidation";

import { useState } from "react";
import { SchemaForm, Dialog } from "@concepta/react-material-ui";
import { Box, Button } from "@mui/material";
import validator from "@rjsf/validator-ajv6";
import useTheme from "@mui/material/styles/useTheme";

import {
  defaultPasswordChangeFormSchema,
  widgets,
  defaultAdvancedProperties,
  defaultValidationRules,
} from "@/components/submodules/PasswordUpdate/constants";
import ConfirmationModal from "@/components/PasswordChangeConfirmationModal";

import { validateForm } from "@/utils/formValidation/formValidation";

interface PasswordUpdateSubmoduleProps {
  queryUri?: string;
  queryMethod?: string;
  title?: string;
  dialogTitle?: string;
  subtitle?: string;
  formSchema?: RJSFSchema;
  formUiSchema?: UiSchema;
  advancedProperties?: Record<string, AdvancedProperty>;
  formData?: Record<string, unknown> | null;
  customValidation?: ValidationRule<Record<string, string>>[];
  submitButtonTitle?: string;
  successFeedbackMessage?: string;
  errorFeedbackMessage?: string;
  confirmationDialogProps?: {
    title?: string;
    subtitle?: string;
    buttonTitle?: string;
  };
  overrideDefaults?: boolean;
}

const PasswordUpdateSubmodule = (props: PasswordUpdateSubmoduleProps) => {
  const theme = useTheme();

  const [formData, setFormData] = useState<Record<string, string>>({
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

  const handleFormSubmit = async (_: IChangeEvent<Record<string, string>>) => {
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
        {props.title || "Update Password"}
      </Button>

      <Dialog
        open={isPasswordChangeModalOpen}
        handleClose={closePasswordChangeModal}
        title={props.dialogTitle || "Change password"}
      >
        <SchemaForm.Form
          schema={{
            ...defaultPasswordChangeFormSchema,
            ...props.formSchema,
            required: props.overrideDefaults
              ? props.formSchema?.required || []
              : [
                  ...(defaultPasswordChangeFormSchema.required || []),
                  ...(props.formSchema?.required || []),
                ],
            properties: props.overrideDefaults
              ? props.formSchema?.properties || {}
              : {
                  ...(defaultPasswordChangeFormSchema.properties || {}),
                  ...(props.formSchema?.properties || {}),
                },
          }}
          validator={validator}
          onSubmit={handleFormSubmit}
          widgets={widgets}
          noHtml5Validate={true}
          showErrorList={false}
          formData={formData}
          advancedProperties={
            props.overrideDefaults
              ? props.advancedProperties
              : { ...defaultAdvancedProperties, ...props.advancedProperties }
          }
          onChange={({ formData }) => {
            setFormData(formData);
          }}
          customValidate={(formData, errors) =>
            validateForm(
              formData,
              errors,
              props.overrideDefaults
                ? props.customValidation || []
                : [...defaultValidationRules, ...(props.customValidation || [])]
            )
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
              {props.submitButtonTitle || "Save"}
            </Button>
          </Box>
        </SchemaForm.Form>
      </Dialog>

      <Dialog
        open={isConfirmationModalOpen}
        handleClose={closeConfirmationModal}
      >
        <ConfirmationModal
          {...props.confirmationDialogProps}
          handleClose={closeConfirmationModal}
        />
      </Dialog>
    </Box>
  );
};

export default PasswordUpdateSubmodule;
