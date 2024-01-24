import type { RJSFSchema, UiSchema } from "@rjsf/utils";
import type { IChangeEvent } from "@rjsf/core";
import type { AdvancedProperty } from "@concepta/react-material-ui/dist/components/SchemaForm/types";
import type { ValidationRule } from "@/utils/formValidation/formValidation";

import { useState, useEffect } from "react";
import { Text } from "@concepta/react-material-ui";
import { useAuth } from "@concepta/react-auth-provider";
import { SchemaForm } from "@concepta/react-material-ui";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import { toast } from "react-toastify";
import validator from "@rjsf/validator-ajv6";
import { CustomTextFieldWidget } from "@concepta/react-material-ui/dist/styles/CustomWidgets";

import { profileFormSchema, defaultProfileUiSchema } from "./constants";

import type { User } from "@/types/User";

import { validateForm } from "@/utils/formValidation/formValidation";

interface ProfileFormSubmoduleProps {
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

const widgets = {
  TextWidget: CustomTextFieldWidget,
};

const ProfileFormSubmodule = (props: ProfileFormSubmoduleProps) => {
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    firstName: "John",
    lastName: "Smith",
  });
  const [isLoadingSubmit, setLoadingSubmit] = useState(false);

  const handleFormSubmit = async (_: IChangeEvent<Record<string, string>>) => {
    setLoadingSubmit(true);

    setTimeout(() => {
      setLoadingSubmit(false);
      toast.success(
        props.successFeedbackMessage || "Profile successfully updated"
      );
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
          {props.title || "Profile"}
        </Text>
        <Text fontWeight="400" fontSize={14}>
          {props.subtitle || "Update your profile"}
        </Text>
      </Box>

      <Box display="flex" mb={4}>
        <SchemaForm.Form
          schema={profileFormSchema}
          uiSchema={{ ...defaultProfileUiSchema, ...props.formUiSchema }}
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
            validateForm(formData, errors, props.customValidation || [])
          }
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
    </Box>
  );
};

export default ProfileFormSubmodule;
