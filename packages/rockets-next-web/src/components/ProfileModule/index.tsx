"use client";

import type { RJSFSchema, UiSchema } from "@rjsf/utils";
import type { ValidationRule } from "@/utils/formValidation/formValidation";
import type { AdvancedProperty } from "@concepta/react-material-ui/dist/components/SchemaForm/types";

import Box from "@mui/material/Box";

import ProfileFormSubmodule from "@/components/submodules/ProfileForm";
import PasswordUpdateSubmodule from "@/components/submodules/PasswordUpdate";

interface FormProps {
  queryUri?: string;
  queryMethod?: string;
  title?: string;
  subtitle?: string;
  formSchema?: RJSFSchema;
  formUiSchema?: UiSchema;
  advancedProperties?: Record<string, AdvancedProperty>;
  formData?: Record<string, unknown> | null;
  customValidation?: ValidationRule<Record<string, string>>[];
  submitButtonTitle?: string;
  successFeedbackMessage?: string;
  errorFeedbackMessage?: string;
  overrideDefaults?: boolean;
}

interface PasswordUpdateProps {
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

interface ProfileModuleProps {
  formProps?: FormProps;
  passwordUpdateProps?: PasswordUpdateProps;
}

const ProfileModule = (props: ProfileModuleProps) => {
  return (
    <Box>
      <ProfileFormSubmodule {...props.formProps} />
      <PasswordUpdateSubmodule {...props.passwordUpdateProps} />
    </Box>
  );
};

export default ProfileModule;
